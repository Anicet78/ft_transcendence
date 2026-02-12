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

	// 2. Create new chat + private_chat rows
	const result = await prisma.$transaction(async (tx) => {
		
		//create 1 row inside chat table
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

		// //create 2 rows inside chat_member and chat_role table, allowing 'writer' to prevent admin problems
		// await prisma.$transaction([
		// 	prisma.chatMember.create({
		// 		data: {
		// 			chatId: chat.chatId,
		// 			userId: user1Id
		// 		}
		// 	}),
		// 	prisma.chatMember.create({
		// 		data: {
		// 			chatId: chat.chatId,
		// 			userId: user2Id
		// 		}
		// 	}),
		// 	prisma.chatRole.createMany({
		// 		data: [
		// 			{
		// 				chatId: chat.chatId,
		// 				userId: user1Id,
		// 				role: 'writer',
		// 				attributedBy: systemUserId
		// 			},
		// 			{
		// 				chatId: chat.chatId,
		// 				userId: user2Id,
		// 				role: 'writer',
		// 				attributedBy: systemUserId
		// 			}
		// 		]
		// 	})
		// ]);

		return privateChat;
	});

	return result;
}
