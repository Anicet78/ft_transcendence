import { PrismaClient, region_list, roles, chat_role_type, type_list, auth_provider } from '@prisma/client';
import argon2 from "argon2";

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool() {
  return Math.random() > 0.5;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...');

  // ── Users ──────────────────────────────────────────────────────────────────
  const regions = Object.values(region_list).filter((r) => r !== 'Deleted');

  const usersData = [
    { firstName: "Nina",   lastName: "Nina",    username: "nina",    mail: "nina@example.com",   passwordHash: "nina1234"  },
    { firstName: "Anicet", lastName: "Anicet",  username: "anicet",  mail: "anicet@example.com", passwordHash: "anicet123" },
    { firstName: "Maxime", lastName: "Maxime",  username: "maxime",  mail: "maxime@example.com", passwordHash: "maxime123" },
    { firstName: "Julie",  lastName: "Julie",   username: "julie",   mail: "julie@example.com",  passwordHash: "julie1234" },
    { firstName: "Tom",    lastName: "Tom",     username: "tom",     mail: "tom@example.com",    passwordHash: "tom12345"  },
    { firstName: 'Frank',  lastName: 'Petit',   username: 'frankP',  mail: 'frank@example.com',  passwordHash: "frank123"  },
    { firstName: 'Grace',  lastName: 'Simon',   username: 'graceS',  mail: 'grace@example.com',  passwordHash: "frank1234" },
    { firstName: 'Hank',   lastName: 'Laurent', username: 'hank_l',  mail: 'hank@example.com',   passwordHash: "hank1234"  },
    { firstName: 'Iris',   lastName: 'Michel',  username: 'iris_m',  mail: 'iris@example.com',   passwordHash: "iris1234"  },
    { firstName: 'Jules',  lastName: 'Garcia',  username: 'jules_g', mail: 'jules@example.com',  passwordHash: "jules1234" },
  ];

  // upsert on username (unique) — safe to re-run
  const users = await Promise.all(
    usersData.map(async (u) => {
      const passwordHash = await hashPassword(u.passwordHash);
      return prisma.appUser.upsert({
        where:  { username: u.username },
        update: {},
        create: {
          ...u,
          passwordHash,
          availability: randomBool(),
          playing:      false,
          region:       randomFrom(regions) as region_list,
        },
      });
    })
  );
  console.log(`✅ Users ready (${users.length})`);

  // ── OAuth Identities ───────────────────────────────────────────────────────
  await prisma.identify.createMany({
    skipDuplicates: true,
    data: [
      { provider: auth_provider.google,   providerId: 'google-uid-001', userId: users[0].appUserId },
      { provider: auth_provider.fortyTwo, providerId: '42-uid-002',     userId: users[1].appUserId },
    ],
  });
  console.log('✅ OAuth identities ready');

  // ── Roles ──────────────────────────────────────────────────────────────────
  // No unique constraint on user_role — only insert if none exist yet for these users
  const existingRoles = await prisma.userRole.count({
    where: { attributedTo: { in: users.map((u) => u.appUserId) } },
  });
  if (existingRoles === 0) {
    await prisma.userRole.createMany({
      data: [
        { attributedTo: users[0].appUserId, attributedBy: users[0].appUserId, role: roles.admin },
        ...users.slice(1).map((u) => ({
          attributedTo: u.appUserId,
          attributedBy: users[0].appUserId,
          role:         roles.user,
        })),
      ],
    });
  }
  console.log('✅ User roles ready');

  // ── Game Profiles ──────────────────────────────────────────────────────────
  await Promise.all(
    users.map((u) =>
      prisma.gameProfile.upsert({
        where:  { userId: u.appUserId },
        update: {},
        create: {
          userId:             u.appUserId,
          totalGames:         randomInt(0, 200),
          totalWins:          randomInt(0, 100),
          totalLoses:         randomInt(0, 100),
          totalEnemiesKilled: randomInt(0, 5000),
          totalXp:            randomInt(0, 100000),
          level:              randomInt(1, 50),
          bestTime:           randomInt(60, 3600),
        },
      })
    )
  );
  console.log('✅ Game profiles ready');

  // ── Game Sessions & Results ────────────────────────────────────────────────
  const sessionIds = Array.from({ length: 5 }, (_, i) => `game-session-seed-${i}`);

  const sessions = await Promise.all(
    sessionIds.map((sessionGameId, i) =>
      prisma.gameSession.upsert({
        where:  { sessionGameId },
        update: {},
        create: {
          sessionGameId,
          startedAt: new Date(Date.now() - (i + 1) * 86400000),
          endedAt:   new Date(),
          status:    'finished',
        },
      })
    )
  );

  for (const session of sessions) {
    const alreadyHasResults = await prisma.gameResult.count({ where: { gameId: session.sessionId } });
    if (alreadyHasResults > 0) continue;

    const players = [...users].sort(() => 0.5 - Math.random()).slice(0, randomInt(2, 4));
    const winnerIdx = randomInt(0, players.length - 1);

    await prisma.gameResult.createMany({
      data: players.map((p, idx) => ({
        gameId:         session.sessionId,
        playerId:       p.appUserId,
        completionTime: randomInt(120, 1800),
        enemiesKilled:  randomInt(0, 50),
        gainedXp:       randomInt(100, 2000),
        isWinner:       idx === winnerIdx,
      })),
    });
  }
  console.log('✅ Game sessions & results ready');

  // ── Friendships ────────────────────────────────────────────────────────────
  const friendshipPairs: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9],
  ];

  for (const [a, b] of friendshipPairs) {
    const exists = await prisma.friendship.findFirst({
      where: { senderId: users[a].appUserId, receiverId: users[b].appUserId },
    });
    if (!exists) {
      await prisma.friendship.create({
        data: {
          senderId:   users[a].appUserId,
          receiverId: users[b].appUserId,
          status:     randomFrom(['waiting', 'accepted', 'accepted', 'accepted']),
        },
      });
    }
  }
  console.log('✅ Friendships ready');

  // ── Block List ─────────────────────────────────────────────────────────────
  const blockExists = await prisma.blockedList.findFirst({
    where: { blocker: users[0].appUserId, blocked: users[9].appUserId },
  });
  if (!blockExists) {
    await prisma.blockedList.create({
      data: { blocker: users[0].appUserId, blocked: users[9].appUserId },
    });
  }
  console.log('✅ Block list ready');

  // ── Group Chat ─────────────────────────────────────────────────────────────
  let groupChat = await prisma.chat.findFirst({
    where: { chatName: 'General', createdBy: users[0].appUserId, chatType: type_list.group },
  });

  if (!groupChat) {
    groupChat = await prisma.chat.create({
      data: { chatType: type_list.group, chatName: 'General', createdBy: users[0].appUserId },
    });

    await prisma.chatMember.createMany({
      skipDuplicates: true,
      data: users.map((u) => ({ chatId: groupChat!.chatId, userId: u.appUserId })),
    });

    await prisma.chatRole.createMany({
      skipDuplicates: true,
      data: [
        { chatId: groupChat.chatId, userId: users[0].appUserId, role: chat_role_type.owner, attributedBy: users[0].appUserId },
        { chatId: groupChat.chatId, userId: users[1].appUserId, role: chat_role_type.admin, attributedBy: users[0].appUserId },
        ...users.slice(2).map((u) => ({
          chatId:       groupChat!.chatId,
          userId:       u.appUserId,
          role:         chat_role_type.member,
          attributedBy: users[0].appUserId,
        })),
      ],
    });

    const groupMessages = await Promise.all(
      [
        { userId: users[0].appUserId, content: 'Hey everyone! 👋' },
        { userId: users[1].appUserId, content: "What's up?" },
        { userId: users[2].appUserId, content: 'Anyone up for a game?' },
        { userId: users[3].appUserId, content: "I'm in!" },
        { userId: users[4].appUserId, content: "Let's go 🎮" },
      ].map((msg) =>
        prisma.chatMessage.create({ data: { chatId: groupChat!.chatId, ...msg } })
      )
    );

    await Promise.all(
      users.slice(0, 5).map((u) =>
        prisma.chatReadState.upsert({
          where:  { chatId_userId: { chatId: groupChat!.chatId, userId: u.appUserId } },
          update: { lastReadMessageId: groupMessages[groupMessages.length - 1].messageId },
          create: {
            chatId:            groupChat!.chatId,
            userId:            u.appUserId,
            lastReadMessageId: groupMessages[groupMessages.length - 1].messageId,
          },
        })
      )
    );
  }
  console.log('✅ Group chat ready');

  // ── Private Chats ──────────────────────────────────────────────────────────
  const privatePairs: [number, number][] = [[0, 1], [1, 2], [0, 3]];

  for (const [a, b] of privatePairs) {
    const [u1, u2] = [users[a], users[b]].sort((x, y) =>
      x.appUserId.localeCompare(y.appUserId)
    );

    const existingPrivate = await prisma.privateChat.findUnique({
      where: { user1Id_user2Id: { user1Id: u1.appUserId, user2Id: u2.appUserId } },
    });
    if (existingPrivate) continue;

    const chat = await prisma.chat.create({
      data: { chatName: `${u1.username}-${u2.username}`, chatType: type_list.private, createdBy: u1.appUserId },
    });

    await prisma.privateChat.create({
      data: { user1Id: u1.appUserId, user2Id: u2.appUserId, chatId: chat.chatId },
    });

    await prisma.chatMember.createMany({
      skipDuplicates: true,
      data: [
        { chatId: chat.chatId, userId: u1.appUserId },
        { chatId: chat.chatId, userId: u2.appUserId },
      ],
    });

    const msgs = await Promise.all([
      prisma.chatMessage.create({ data: { chatId: chat.chatId, userId: u1.appUserId, content: 'Hey, how are you?' } }),
      prisma.chatMessage.create({ data: { chatId: chat.chatId, userId: u2.appUserId, content: 'All good, you?' } }),
    ]);

    await Promise.all(
      [u1, u2].map((u) =>
        prisma.chatReadState.upsert({
          where:  { chatId_userId: { chatId: chat.chatId, userId: u.appUserId } },
          update: { lastReadMessageId: msgs[msgs.length - 1].messageId },
          create: {
            chatId:            chat.chatId,
            userId:            u.appUserId,
            lastReadMessageId: msgs[msgs.length - 1].messageId,
          },
        })
      )
    );
  }
  console.log('✅ Private chats ready');

  // ── Chat Ban ───────────────────────────────────────────────────────────────
  const banExists = await prisma.chatBan.findFirst({
    where: { chatId: groupChat.chatId, userId: users[9].appUserId },
  });
  if (!banExists) {
    await prisma.chatBan.create({
      data: {
        chatId:    groupChat.chatId,
        userId:    users[9].appUserId,
        bannedBy:  users[0].appUserId,
        reason:    'Toxic behavior',
        expiresAt: new Date(Date.now() + 7 * 86400000),
      },
    });
  }
  console.log('✅ Chat ban ready');

  // ── Chat Invitation ────────────────────────────────────────────────────────
  const inviteExists = await prisma.chatInvitation.findFirst({
    where: { senderId: users[0].appUserId, receiverId: users[8].appUserId, chatId: groupChat.chatId },
  });
  if (!inviteExists) {
    await prisma.chatInvitation.create({
      data: {
        senderId:   users[0].appUserId,
        receiverId: users[8].appUserId,
        chatId:     groupChat.chatId,
        status:     'waiting',
      },
    });
  }
  console.log('✅ Chat invitation ready');

  // ── Refresh Tokens ─────────────────────────────────────────────────────────
  for (const u of users.slice(0, 3)) {
    const tokenExists = await prisma.refreshToken.findFirst({ where: { userId: u.appUserId } });
    if (!tokenExists) {
      await prisma.refreshToken.create({
        data: {
          userId:    u.appUserId,
          tokenHash: `fake-token-hash-${u.username}-${Date.now()}`,
          expiresAt: new Date(Date.now() + 30 * 86400000),
        },
      });
    }
  }
  console.log('✅ Refresh tokens ready');

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });