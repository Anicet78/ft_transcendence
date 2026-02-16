import { prisma } from '../prisma.js';
import { AppError } from '../../../schema/errorSchema.js';

//shared chat infos model
export const chatSelect = {
	chatId: true,
	chatType: true,
	chatName: true,
	createdAt: true,
	deletedAt: true,

	creator: {
		select: {
			appUserId: true,
			username: true,
			avatarUrl: true,
			availability: true
		}
	},

	members: {
	select: {
		chatMemberId: true,
		joinedAt: true,
		leftAt: true,
		user: {
			select: {
				appUserId: true,
				username: true,
				avatarUrl: true,
				availability: true
			}
		}
	}
	},

	roles: {
		select: {
			userId: true,
			role: true
		}
	}
};

export async function getChatByIdForUser(chatId: string, userId: string) {
	// Ensure user is a member
	const isMember = await prisma.chatMember.findFirst({
		where: { chatId, userId }
	});

	if (!isMember)
		throw new AppError('You are not a member of this chat', 403);

	// Fetch chat with full details
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: chatSelect
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	//check if there is a blocking relation preventing user to access chat (for private chat only)
	if (chat.chatType == "private") {
		const privateChat = await prisma.privateChat.findUnique({
			where: { privateChatId: chatId},
			select: {
				privateChatId: true,
				user1Id: true,
				user2Id: true
			}
		});

		const otherUserId = privateChat?.user1Id === userId
			? privateChat.user2Id
			: privateChat?.user1Id;

		if (otherUserId) {
			const isBlocked = await prisma.blockedList.findFirst({
				where: {
					OR: [
						{ blocker: userId, blocked: otherUserId },
						{ blocker: otherUserId, blocked: userId }
					]
				}
			});

		if (isBlocked)
			throw new AppError("You cannot access this chat due to a block", 403);
		//add user message
		}
	}

	return chat;
}


//RETURN USER'S CHAT LIST
export async function listUserChats(userId: string) {

	const blocked = await prisma.blockedList.findMany({
		where: {
			OR: [
				{ blocker: userId },
				{ blocked: userId }
			]
		}
	});

	const blockedIds = blocked
		.map(b => (b.blocker === userId ? b.blocked : b.blocker))
		.filter((id): id is string => id !== null && id !== undefined);

	// const chats = await prisma.chat.findMany({
	// 	where: {
	// 		members: {
	// 		some: { userId }
	// 		}
	// 	},
	// 	select: chatSelect
	// });

	const chats = await prisma.chat.findMany({
		where: {
			members: { some: { userId } },
			NOT: {
			AND: [
				{ chatType: "private" },
				{
				privateChat: {
					some: {
						OR: [
						{ user1Id: { in: blockedIds } },
						{ user2Id: { in: blockedIds } }
						]
					}
				}
				}
			]
			}
		},
		select: chatSelect
	});

	return chats;
}
