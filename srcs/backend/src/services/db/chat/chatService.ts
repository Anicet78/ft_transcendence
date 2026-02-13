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

	return chat;
}


//RETURN USER'S CHAT LIST
export async function listUserChats(userId: string) {
	const chats = await prisma.chat.findMany({
		where: {
			members: {
			some: { userId }
			}
		},
		select: chatSelect
	});

	return chats;
}
