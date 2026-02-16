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
    { firstName: "Bob", lastName: "Builder", username: "bob", email: "bob@example.com", password: "bob123", region: "NA" },
    { firstName: "Charlie", lastName: "Day", username: "charlie", email: "charlie@example.com", password: "charlie123", region: "EU" },
    { firstName: "Diana", lastName: "Prince", username: "diana", email: "diana@example.com", password: "diana123", region: "APAC" },
    { firstName: "Eve", lastName: "Hacker", username: "eve", email: "eve@example.com", password: "eve123", region: "OCE" },
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

console.log(Object.keys(prisma));

//BLOCKLIST
async function seedBlocks(users) {
  const blocks = [
    [users[0], users[3]], // Nina blocks Julie
    [users[5], users[0]], // Alice blocks Nina
    [users[1], users[6]], // Anicet blocks Bob
    [users[7], users[2]], // Charlie blocks Maxime
    [users[9], users[3]], // Eve blocks Julie
  ];

  for (const [blocker, blocked] of blocks) {
    await prisma.blockedList.create({
      data: {
        blocker: blocker.appUserId,
        blocked: blocked.appUserId,
      },
    });
  }
}

// FRIENDSHIPS
async function seedFriendships(users) {
  const pairs = [
    [users[0], users[1], "accepted"],
	  [users[0], users[3], "accepted"],
	  [users[4], users[0], "waiting"],
    [users[1], users[3], "accepted"],
    [users[2], users[4], "waiting"],
    [users[3], users[4], "accepted"],
  ];

  for (const [sender, receiver, status] of pairs) {
    await prisma.friendship.create({
      data: {
        senderId: sender.appUserId,
        receiverId: receiver.appUserId,
        status,
      },
    });
  }
}

// PRIVATE CHATS
async function seedPrivateChats(users) {
  const pairs = [
    [users[0], users[1]],
    [users[3], users[4]],
  ];

  for (const [u1, u2] of pairs) {

    // Enforce ordering for the DB constraint
    const [user1Id, user2Id] =
      u1.appUserId < u2.appUserId
        ? [u1.appUserId, u2.appUserId]
        : [u2.appUserId, u1.appUserId];

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
        privateChat: {
          connectOrCreate: {
            where: {
              user1Id_user2Id: { user1Id, user2Id },
            },
            create: {
              user1Id,
              user2Id,
            },
          },
        },
      },
    });

    // Static messages
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
          { userId: owner.appUserId, role: chat_role_type.owner, attributedBy: owner.appUserId },
          { userId: admin.appUserId, role: chat_role_type.admin, attributedBy: owner.appUserId },
          { userId: moderator.appUserId, role: chat_role_type.moderator, attributedBy: owner.appUserId },
          { userId: writer.appUserId, role: chat_role_type.writer, attributedBy: owner.appUserId },
          { userId: member.appUserId, role: chat_role_type.member, attributedBy: owner.appUserId },
        ],
      },
    },
  });

  // Static messages
  await prisma.chatMessage.createMany({
    data: [
      { chatId: chat.chatId, userId: owner.appUserId, content: "Welcome everyone!" },
      { chatId: chat.chatId, userId: admin.appUserId, content: "Glad to be here." },
      { chatId: chat.chatId, userId: moderator.appUserId, content: "Let's keep things clean." },
      { chatId: chat.chatId, userId: writer.appUserId, content: "Ready to play!" },
      { chatId: chat.chatId, userId: member.appUserId, content: "Hi all!" },
    ],
  });

  // Ban one user (Tom)
  await prisma.chatBan.create({
    data: {
      chatId: chat.chatId,
      userId: member.appUserId,
      bannedBy: owner.appUserId,
      reason: "Spamming",
    },
  });

  // Invitations
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
async function seedGameProfiles(users) {
  for (const u of users) {
    await prisma.gameProfile.create({
      data: {
        userId: u.appUserId,
        totalGames: 10,
        totalWins: 5,
        totalLoses: 5,
        totalEnemiesKilled: 100,
        totalXp: 500,
        level: 3,
        bestTime: 120,
      },
    });
  }
}

// GAME SESSIONS + RESULTS
async function seedGameSessions(users) {
  const maps = ["Forest", "Desert", "Ruins"];

  for (const map of maps) {
    const session = await prisma.gameSession.create({
      data: {
        mapName: map,
        status: "finished",
      },
    });

    for (const u of users) {
      await prisma.gameResult.create({
        data: {
          gameId: session.sessionId,
          playerId: u.appUserId,
          enemiesKilled: 10,
          gainedXp: 50,
          isWinner: u === users[0], // Nina wins all sessions
        },
      });
    }
  }
}

// MAIN
async function main() {
	const adminEmail = "admin@transcendence.com";
	const adminFirstname = "admin";
	const adminLastname = "admin";
	const adminUsername = "admin";
	const adminPassword = await hashPassword("password123");

	console.log("🌱 Seeding database...");

	await prisma.appUser.upsert({
		where: { mail: adminEmail },
		update: {},
		create: {
			firstName: adminFirstname,
			lastName: adminLastname,
			username: adminUsername,
			mail: adminEmail,
			region: "EU",
			passwordHash: adminPassword,
			rolesReceived: {
				create: {
					role: "admin",
				}
			}
		},
	});

  const users = await createFixedUsers();
  console.log(" Users created!");

  await prisma.chat.deleteMany();
  await prisma.privateChat.deleteMany();
  await prisma.chatMember.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatRole.deleteMany();
  await prisma.chatBan.deleteMany();
  await prisma.chatInvitation.deleteMany();


  await seedBlocks(users);
  console.log(" Blocks created!");
  await seedFriendships(users);
  console.log(" Friendships created!");
  await seedPrivateChats(users);
  console.log(" PrivateChats created!");
  await seedGroupChat(users);
  console.log(" GroupChat created!");
  await seedGameProfiles(users);
  console.log(" GameProfiles created!");
  await seedGameSessions(users);
  console.log(" GameSessions created!");

  console.log("🌱 Seeding complete!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
