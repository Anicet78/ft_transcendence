import { prisma } from '../prisma.js';
// import { AppError } from '../../schema/errorSchema.js';

export async function findOrCreatePrivateChat(userA: string, userB: string) {
	// Sort IDs to enforce consistent ordering, as we've declared uniqueness rule in init.sql
	 const user1Id = userA < userB ? userA : userB;
	 const user2Id = userA < userB ? userB : userA;
	
	// 1. check if a private chat already exists
	const existing = await prisma.privateChat.findFirst({
		where: { user1Id, user2Id },
		select: {
			privateChatId: true,
			chatId: true
		}
	});

	if (existing) {
		return existing; // reuse old chat
	}

	// 2. Fetch usernames to construct chatName
	const users = await prisma.appUser.findMany({
		where: { appUserId: { in: [user1Id, user2Id] } },
		select: { appUserId: true, username: true }
	});

	if (users.length !== 2) {
		throw new Error("Users not found");
}

	const userMap = new Map(users.map(u => [u.appUserId, u.username]));
	const chatName = `${userMap.get(user1Id)} - ${userMap.get(user2Id)}`;

	// 3. Create new chat + private_chat rows
	const result = await prisma.$transaction(async (tx) => {
		
		//create 1 row inside chat table
		const chat = await tx.chat.create({
			data: {
				chatType: 'private',
				chatName: chatName,
				members: {
					create: [
						{ userId: user1Id },
						{ userId: user2Id }
					]
				},
				roles: {//doesnt work, need to check why
					create: [
						{
							userId: user1Id,
							role: 'writer',
							attributedBy: user2Id
						},
						{
							userId: user2Id,
							role: 'writer',
							attributedBy: user1Id
						}
					]
				}
			},
			select: { chatId: true }
		});

		//create 1 row inside private_chat table
		const privateChat = await tx.privateChat.create({
			data: {
				user1Id,
				user2Id,
				chatId: chat.chatId
			},
			select: {
				privateChatId: true,
				chatId: true
			}
		});

		return privateChat;
	});

	return result;
}
