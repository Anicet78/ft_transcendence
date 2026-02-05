import { prisma } from '../prisma.js';
// import { AppError } from '../../schema/errorSchema.js';

export async function findOrCreatePrivateChat(userA: string, userB: string) {
	// Sort IDs to enforce consistent ordering, as we've declared uniqueness rule in init.sql
	 const user1Id = userA < userB ? userA : userB;
	 const user2Id = userA < userB ? userB : userA;
	//  const [user1Id, user2Id] = [userA, userB].sort();
	
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

	// 2. Create new chat + private_chat rows
	const result = await prisma.$transaction(async (tx) => {
	const chat = await tx.chat.create({
		data: {
		chatType: 'private',
		chatName: null,
		members: {
			create: [
			{ userId: user1Id },
			{ userId: user2Id }
			]
		}
		},
		select: { chatId: true }
	});

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
