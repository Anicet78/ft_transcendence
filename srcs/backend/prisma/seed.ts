import { PrismaClient, roles, region_list, chat_role_type } from '@prisma/client';
import { hashPassword } from '../src/services/auth/password.js';
const prisma = new PrismaClient();

// USERS
async function createFixedUsers() {
  const users = [
    { firstName: "Nina", lastName: "Nina", username: "nina", email: "nina@example.com", password: "nina1234", region: "EU" },
    { firstName: "Anicet", lastName: "Anicet", username: "anicet", email: "anicet@example.com", password: "anicet123", region: "NA" },
    { firstName: "Maxime", lastName: "Maxime", username: "maxime", email: "maxime@example.com", password: "maxime123", region: "EU" },
    { firstName: "Julie", lastName: "Julie", username: "julie", email: "julie@example.com", password: "julie1234", region: "APAC" },
    { firstName: "Tom", lastName: "Tom", username: "tom", email: "tom@example.com", password: "tom12345", region: "OCE" },

    { firstName: "Alice", lastName: "Wonder", username: "alice", email: "alice@example.com", password: "alice123", region: "EU" },
    { firstName: "Bob", lastName: "Builder", username: "bob", email: "bob@example.com", password: "bob12345", region: "NA" },
    { firstName: "Charlie", lastName: "Day", username: "charlie", email: "charlie@example.com", password: "charlie123", region: "EU" },
    { firstName: "Diana", lastName: "Prince", username: "diana", email: "diana@example.com", password: "diana1234", region: "APAC" },
    { firstName: "Eve", lastName: "Hacker", username: "eve", email: "eve@example.com", password: "eve12345", region: "OCE" },
  ];

  const created = [];

  for (const u of users) {
    const user = await prisma.appUser.upsert({
      where: { mail: u.email },
      update: {},
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        mail: u.email,
        passwordHash: await hashPassword(u.password),
        region: u.region as region_list,
      },
    });

    created.push(user);
  }

  return created;
}

// BLOCKLIST
async function seedBlocks(users) {
  const blocks = [
    [users[0], users[3]], // Nina blocks Julie
    [users[5], users[0]], // Alice blocks Nina
    [users[1], users[6]], // Anicet blocks Bob
    [users[7], users[2]], // Charlie blocks Maxime
    [users[9], users[3]], // Eve blocks Julie
  ];

  for (const [blocker, blocked] of blocks) {
    const existing = await prisma.blockedList.findFirst({
      where: { blocker: blocker.appUserId, blocked: blocked.appUserId, deletedAt: null },
    });
    if (!existing) {
      await prisma.blockedList.create({
        data: { blocker: blocker.appUserId, blocked: blocked.appUserId },
      });
    }
  }
}

// FRIENDSHIPS
async function seedFriendships(users) {
  const pairs = [
    [users[0], users[1], "accepted"],
    [users[0], users[2], "accepted"],
    [users[0], users[3], "accepted"],
    [users[5], users[0], "accepted"],
    [users[0], users[6], "accepted"],
    [users[0], users[7], "accepted"],
    [users[0], users[8], "waiting"],
    [users[4], users[0], "waiting"],
    [users[1], users[3], "accepted"],
    [users[2], users[4], "waiting"],
    [users[3], users[4], "accepted"],
  ];

  for (const [sender, receiver, status] of pairs) {
    const existing = await prisma.friendship.findFirst({
      where: { senderId: sender.appUserId, receiverId: receiver.appUserId, deletedAt: null },
    });
    if (!existing) {
      await prisma.friendship.create({
        data: { senderId: sender.appUserId, receiverId: receiver.appUserId, status },
      });
    }
  }
}

// PRIVATE CHATS
async function seedPrivateChats(users) {
  const pairs = [
    [users[0], users[1]],
    [users[3], users[4]],
  ];

  for (const [u1, u2] of pairs) {
    const [user1Id, user2Id] =
      u1.appUserId < u2.appUserId
        ? [u1.appUserId, u2.appUserId]
        : [u2.appUserId, u1.appUserId];

    const existing = await prisma.privateChat.findUnique({
      where: { user1Id_user2Id: { user1Id, user2Id }, deletedAt: null },
    });
    if (existing) continue;

    const chat = await prisma.chat.create({
      data: {
        chatType: "private",
        chatName: `${u1.username}-${u2.username}`,
        createdBy: u1.appUserId,
        members: {
          create: [
            { userId: u1.appUserId },
            { userId: u2.appUserId },
          ],
        },
        roles: {
          create: [
            { userId: u1.appUserId, role: chat_role_type.writer, attributedBy: u1.appUserId },
            { userId: u2.appUserId, role: chat_role_type.writer, attributedBy: u1.appUserId },
          ],
        },
        privateChat: {
          connectOrCreate: {
            where: { user1Id_user2Id: { user1Id, user2Id } },
            create: { user1Id, user2Id },
          },
        },
      },
    });

    await prisma.chatMessage.createMany({
      data: [
        { chatId: chat.chatId, userId: u1.appUserId, content: "Hello!" },
        { chatId: chat.chatId, userId: u2.appUserId, content: "Hi!" },
        { chatId: chat.chatId, userId: u1.appUserId, content: "How are you?" },
        { chatId: chat.chatId, userId: u2.appUserId, content: "Doing great!" },
      ],
    });
  }
}

// GROUP CHAT
async function seedGroupChat(users) {
  // Skip if group chat already exists
  const existing = await prisma.chat.findFirst({
    where: { chatType: "group", chatName: "Gamers United", deletedAt: null }
  });
  if (existing) return;

  const owner = users[0];
  const admin = users[1];
  const moderator = users[2];
  const writer = users[3];
  const member = users[4];

  const chat = await prisma.chat.create({
    data: {
      chatType: "group",
      chatName: "Gamers United",
      createdBy: owner.appUserId,
      members: {
        create: users.map((u) => ({ userId: u.appUserId })),
      },
      roles: {
        create: [
          { userId: owner.appUserId,     role: chat_role_type.owner,     attributedBy: owner.appUserId },
          { userId: admin.appUserId,     role: chat_role_type.admin,     attributedBy: owner.appUserId },
          { userId: moderator.appUserId, role: chat_role_type.moderator, attributedBy: owner.appUserId },
          { userId: writer.appUserId,    role: chat_role_type.writer,    attributedBy: owner.appUserId },
          { userId: member.appUserId,    role: chat_role_type.member,    attributedBy: owner.appUserId },
          // Les 5 users restants reçoivent le rôle member par défaut
          { userId: users[5].appUserId,  role: chat_role_type.member,    attributedBy: owner.appUserId },
          { userId: users[6].appUserId,  role: chat_role_type.member,    attributedBy: owner.appUserId },
          { userId: users[7].appUserId,  role: chat_role_type.member,    attributedBy: owner.appUserId },
          { userId: users[8].appUserId,  role: chat_role_type.member,    attributedBy: owner.appUserId },
          { userId: users[9].appUserId,  role: chat_role_type.member,    attributedBy: owner.appUserId },
        ],
      },
    },
});

  const messageAuthors = [owner, admin, moderator, writer, member];
  const messages = Array.from({ length: 100 }).map((_, i) => ({
    chatId: chat.chatId,
    userId: messageAuthors[i % messageAuthors.length].appUserId,
    content: `Gamers United message #${i + 1}`,
  }));

  await prisma.chatMessage.createMany({ data: messages });

  await prisma.chatInvitation.createMany({
    data: [
      { chatId: chat.chatId, senderId: owner.appUserId, receiverId: admin.appUserId, status: "accepted" },
      { chatId: chat.chatId, senderId: admin.appUserId, receiverId: moderator.appUserId, status: "waiting" },
      { chatId: chat.chatId, senderId: moderator.appUserId, receiverId: writer.appUserId, status: "accepted" },
      { chatId: chat.chatId, senderId: writer.appUserId, receiverId: member.appUserId, status: "waiting" },
    ],
  });
}

// GAME PROFILES
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedGameProfiles(users) {
  for (const u of users) {
    const existing = await prisma.gameProfile.findUnique({
      where: { userId: u.appUserId },
    });
    if (existing) continue;

    const totalGames = randomInt(5, 20);
    const totalWins = randomInt(0, totalGames);
    const totalLoses = totalGames - totalWins;
    const totalEnemiesKilled = randomInt(50, 500);
    const totalXp = randomInt(100, 1000);
    const level = Math.floor(totalXp / 200) + 1;
    const bestTime = randomInt(80, 200);

    await prisma.gameProfile.create({
      data: {
        userId: u.appUserId,
        totalGames,
        totalWins,
        totalLoses,
        totalEnemiesKilled,
        totalXp,
        level,
        bestTime,
      },
    });
  }
}

// GAME SESSIONS + RESULTS
async function seedGameSessions(users) {
  const maps = [
    { sessionGameId: "seed-session-forest", label: "Forest" },
    { sessionGameId: "seed-session-desert", label: "Desert" },
    { sessionGameId: "seed-session-ruins",  label: "Ruins"  },
  ];

  for (const map of maps) {
    const session = await prisma.gameSession.upsert({
      where: { sessionGameId: map.sessionGameId },
      update: {},
      create: {
        sessionGameId: map.sessionGameId,
        status: "finished",
        startedAt: new Date(),
      },
    });

    for (const u of users) {
      const existing = await prisma.gameResult.findFirst({
        where: { gameId: session.sessionId, playerId: u.appUserId },
      });
      if (existing) continue;

      await prisma.gameResult.create({
        data: {
          gameId: session.sessionId,
          playerId: u.appUserId,
          enemiesKilled: 10,
          gainedXp: 50,
          isWinner: u === users[0],
        },
      });
    }
  }
}

// MAIN
async function main() {
  const adminEmail = "admin@transcendence.com";

  console.log("🌱 Seeding database...");

  await prisma.appUser.upsert({
    where: { mail: adminEmail },
    update: {},
    create: {
      firstName: "admin",
      lastName: "admin",
      username: "admin",
      mail: adminEmail,
      region: "EU",
      passwordHash: await hashPassword("password123"),
      rolesReceived: {
        create: { role: "admin" }
      }
    },
  });

  const users = await createFixedUsers();
  console.log("✅ Users created!");

  await seedBlocks(users);
  console.log("✅ Blocks created!");
  await seedFriendships(users);
  console.log("✅ Friendships created!");
  await seedPrivateChats(users);
  console.log("✅ PrivateChats created!");
  await seedGroupChat(users);
  console.log("✅ GroupChat created!");
  await seedGameProfiles(users);
  console.log("✅ GameProfiles created!");
  await seedGameSessions(users);
  console.log("✅ GameSessions created!");

  console.log("🌱 Seeding complete!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());