import { prisma } from '../prisma.js';
import { chat_role_type } from '@prisma/client';
import { AppError } from '../../../schema/errorSchema.js';
import {
	ROLE_RANK,
	getRoleRank
} from '../../../utils/chatRoles.js';

export const messageSelect = {
	
	messageId: true,
	chatId: true,
	userId: true,
	content: true,
	status: true,
	postedAt: true,
	editedAt: true,
	deletedAt: true,
	moderatedBy: true,
	author: {
		select: {
			appUserId: true,
			username: true,
			avatarUrl: true,
			availability: true
		}
	}
};

//SEND MESSAGE
export async function sendMessage(chatId: string, userId: string, content: string) {
	// 1. check if chat exists
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: { chatId: true }
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	// if (chat.deletedAt !== null) {
	// 	throw new AppError('This chat has been disbanded', 410);
	// }

	// 2. is user a member
	const member = await prisma.chatMember.findFirst({
		where: { chatId, userId }
	});

	if (!member)
		throw new AppError('You are not a member of this chat', 403);

	// 3. check user is not banned
	const ban = await prisma.chatBan.findFirst({
		where: {
			chatId,
			userId,
			deletedAt: null,
			OR: [
				{ expiresAt: null },
				{ expiresAt: { gt: new Date() } }
			]
		}
	});

	if (ban)
		throw new AppError('You are banned from this chat', 403);

	// 4. Check user role always writting (writer or above)
	const role = await prisma.chatRole.findFirst({
		where: { chatId, userId },
		select: { role: true }
	});

	const type = await prisma.chat.findFirst({
		where: { chatId },
		select: { chatType: true }
	});

	//check user role, if dont exists, define as member by default
	const userRole = role?.role ?? chat_role_type.member;
	//check if chat is group chat
	const chatType = type?.chatType;
	if (userRole == 'member' && chatType == 'group')
		throw new AppError('You do not have permission to write in this chat', 403);

	// 4. Create message
	const message = await prisma.chatMessage.create({
		data: {
			chatId,
			userId,
			status: 'posted',
			content
		},
		select: messageSelect
	});

	return message;
}

//DELETE MESSAGE
export async function deleteMessage(chatId: string, messageId: string, userId: string) {
	// 1. Load message
	const message = await prisma.chatMessage.findUnique({
		where: { messageId },
		select: {
			messageId: true,
			chatId: true,
			userId: true, // author
			status: true
		}
	});

	if (!message || message.chatId !== chatId) {
		throw new AppError('Message not found', 404);
	}

	const isAuthor = message.userId === userId;
	if (!isAuthor) {
		throw new AppError('You do not have permission to delete this message', 403);
	}

	// 3. Soft delete
	const updated = await prisma.chatMessage.update({
		where: { messageId },
		data: {
			status: 'deleted',
			deletedAt: new Date()
		},
		select: messageSelect//{
		// 	messageId: true,
		// 	chatId: true,
		// 	status: true,
		// 	deletedAt: true//,
		// 	// author: {
		// 	// 	select: {
		// 	// 	appUserId: true,
		// 	// 	username: true,
		// 	// 	avatarUrl: true,
		// 	// 	availability: true
		// 	// 	}
		// 	// }
		// }
	});

	return updated;
}

//RETRIEVE CONVERSATION MESSAGES
export async function getChatMessages(chatId: string, userId: string) {
	// 1. Check user is member of this conversation
	const isMember = await prisma.chatMember.findFirst({
		where: { chatId, userId }
	});

	if (!isMember)
		throw new AppError('You are not a member of this chat', 403);

	// Find all users who block or are blocked by current user
	const blockedRelations = await prisma.blockedList.findMany({
	where: {
		OR: [
			{ blocker: userId },
			{ blocked: userId }
		]
	}
	});

	const blockedUserIds = blockedRelations
		.map(b => b.blocker === userId ? b.blocked : b.blocker)
		.filter((id): id is string => id !== null && id !== undefined);


	// 3. Retrieve messages
	const messages = await prisma.chatMessage.findMany({
		where: { 
			chatId,
			userId: { notIn: blockedUserIds}
		},
		orderBy: { postedAt: 'asc' },
		select: messageSelect
	});

	return messages;
}

//EDIT MESSAGE (for writer user only)
export async function editMessage(
	chatId: string,
	messageId: string,
	userId: string,
	newContent: string
){
	// 1. Load message
	const message = await prisma.chatMessage.findUnique({
		where: { messageId },
		select: {
			messageId: true,
			chatId: true,
			userId: true,
			status: true
		}
	});

	if (!message || message.chatId !== chatId)
		throw new AppError('Message not found', 404);

	// 2. Only author can edit
	if (message.userId !== userId)
		throw new AppError('You do not have permission to edit this message', 403);

	// 3. Update message
	const updated = await prisma.chatMessage.update({
		where: { messageId },
		data: {
			content: newContent,
			status: 'edited',
			editedAt: new Date(),
			deletedAt: null
		},
		select: messageSelect//{
		// 	messageId: true,
		// 	chatId: true,
		// 	userId: true,
		// 	content: true,
		// 	status: true,
		// 	editedAt: true,
		// 	author: {
		// 		select: {
		// 			appUserId: true,
		// 			username: true,
		// 			avatarUrl: true,
		// 			availability: true
		// 		}
		// 	}
		// }
	});

	return updated;
}

//MODERATE MESSAGE
export async function moderateMessage(
	chatId: string,
	messageId: string,
	moderatorId: string
){
	// 1. Load message
	const message = await prisma.chatMessage.findUnique({
		where: { messageId },
		select: {
			messageId: true,
			chatId: true,
			userId: true
		}
	});

	if (!message || message.chatId !== chatId)
		throw new AppError('Message not found', 404);

	// 2. Check moderator role
	const moderatorRole = await prisma.chatRole.findFirst({
		where: { chatId, userId: moderatorId, deletedAt: null },
		select: { role: true }
	});

	const moderatorRank = getRoleRank(moderatorRole?.role);

	if (moderatorRank < ROLE_RANK.moderator)
		throw new AppError('You do not have permission to moderate messages', 403);

	// 3. Moderate message
	const updated = await prisma.chatMessage.update({
		where: { messageId },
		data: {
			status: 'moderated',
			deletedAt: new Date(),
			moderatedBy: moderatorId
		},
		select: messageSelect//{
		// 	messageId: true,
		// 	chatId: true,
		// 	status: true,
		// 	deletedAt: true,
		// 	author: {
		// 		select: {
		// 		appUserId: true,
		// 		username: true,
		// 		avatarUrl: true,
		// 		availability: true
		// 		}
		// 	}
		// }
	});

	return updated;
}

//RESTORE MESSAGE
export async function restoreMessage(
	chatId: string,
	messageId: string,
	moderatorId: string
){
	// 1. Load message
	const message = await prisma.chatMessage.findUnique({
		where: { messageId },
		select: {
			messageId: true,
			chatId: true,
			status: true,
			deletedAt: true
		}
	});

	if (!message || message.chatId !== chatId) {
		throw new AppError('Message not found', 404);
	}

	// 2. Only moderated messages can be restored
	if (message.status !== 'moderated') {
		throw new AppError('Only moderated messages can be restored', 400);
	}

	// 3. Check moderator role
	const moderatorRole = await prisma.chatRole.findFirst({
		where: { chatId, userId: moderatorId, deletedAt: null },
		select: { role: true }
	});

	const moderatorRank = getRoleRank(moderatorRole?.role);

	if (moderatorRank < ROLE_RANK.moderator) {
		throw new AppError('You do not have permission to restore messages', 403);
	}

	// 4. Restore message
	const updated = await prisma.chatMessage.update({
		where: { messageId },
		data: {
			status: 'posted',
			deletedAt: null,
			moderatedBy: null
		},
		select: messageSelect//{
		// 	messageId: true,
		// 	chatId: true,
		// 	status: true,
		// 	author: {
		// 		select: {
		// 		appUserId: true,
		// 		username: true,
		// 		avatarUrl: true,
		// 		availability: true
		// 		}
		// 	}
		// }
	});
	return updated;
}

//RETURN CHAT RECEIPTS
export async function chatReceiptsService(chatId: string) {

	const receipts = await prisma.chatReceipt.findMany({
		where: { chatId },
		include: { user: true }
	});

	return receipts;
}
