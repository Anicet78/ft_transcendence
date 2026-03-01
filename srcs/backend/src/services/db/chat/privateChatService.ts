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
	const [user1, user2] = await prisma.user.findMany({
		where: { id: { in: [user1Id, user2Id] } },
		select: { id: true, name: true }
	});

	const user1Name = user1.id === user1Id ? user1.name : user2.name;
	const user2Name = user2.id === user2Id ? user2.name : user1.name;
	const chatName = `${user1Name} - ${user2Name}`;

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
