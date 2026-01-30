import { prisma } from './prisma.js';
import { AppError } from '../../schema/errorSchema.js';

//GROUP CREATION
export async function createGroupChat(creatorId: string, name: string | null, memberIds: string[]) {
	const uniqueMembers = Array.from(new Set([...memberIds, creatorId]));

	const chat = await prisma.chat.create({
	data: {
		chatType: 'group',
		chatName: name,
		createdBy: creatorId,
		members: {
		create: uniqueMembers.map((userId) => ({
			userId,
			joinedAt: new Date()
		}))
		},

		roles: {
		create: [{
			userId: creatorId,
			role: 'owner',
			attributedBy: creatorId
			}]
		}
	},
	select: {
		chatId: true,
		chatType: true,
		chatName: true,
		createdAt: true,

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
	}
	});
	return chat;
}


//INVITATION
export async function inviteToGroupChat(chatId: string, senderId: string, receiverId: string) {
	// 1. Check chat exists and is group
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: {
			chatId: true,
			chatType: true
		}
	});

	if (!chat || chat.chatType !== 'group') {
		throw new AppError('Chat not found or not a group chat', 404);
	}

	// 2. Check sender is a member
	const isMember = await prisma.chatMember.findFirst({
	where: { chatId, userId: senderId }
	});

	if (!isMember) {
		throw new AppError('You are not a member of this group', 403);
	}

	// 3. Check receiver is not already a member
	const alreadyMember = await prisma.chatMember.findFirst({
	where: { chatId, userId: receiverId }
	});

	if (alreadyMember) {
		throw new AppError('User is already a member of this group', 409);//or send 400 ?
	}

	// 4. Prevent duplicate invitations
	const existingInvite = await prisma.chatInvitation.findFirst({
	where: { chatId, receiverId, status: 'waiting' }
	});

	if (existingInvite) {
		throw new AppError('An invitation is already pending for this user', 409);
	}

	// 5. Create invitation
	const invitation = await prisma.chatInvitation.create({
	data: {
		chatId,
		senderId,
		receiverId,
		status: 'waiting'
	},
	select: {
		chatInvitationId: true,
		chatId: true,
		senderId: true,
		receiverId: true,
		status: true,
		createdAt: true
	}
	});

	return invitation;
}

//ANSWER PENDING GROUP CHAT INVITATION
export async function acceptGroupInvitation( chatInvitationId: string, userId: string ) {
	// 1. Load invitation
	const invitation = await prisma.chatInvitation.findUnique({
	where: { chatInvitationId },
	select: {
		chatInvitationId: true,
		chatId: true,
		receiverId: true,
		status: true
	}
	});

	if (!invitation) {
		throw new AppError('Invitation not found', 404);
	}

	// 2. Must be waiting
	if (invitation.status !== 'waiting') {
		throw new AppError('Invitation is not pending', 400);
	}

	// 3. Only receiver can accept
	if (invitation.receiverId !== userId) {
		throw new AppError('You are not allowed to accept this invitation', 403);
	}

	// 4. Chat must exist and be group
	const chat = await prisma.chat.findUnique({
	where: { chatId: invitation.chatId! },
	select: { chatType: true }
	});

	if (!chat || chat.chatType !== 'group') {
		throw new AppError('Chat not found or not a group chat', 404);
	}

	// 5. Prevent duplicate membership
	const alreadyMember = await prisma.chatMember.findFirst({
	where: { chatId: invitation.chatId!, userId }
	});

	if (alreadyMember) {
		throw new AppError('You are already a member of this group', 409);
	}

	// 6–7. Create member + role in a transaction
	const result = await prisma.$transaction(async (tx) => {
	const member = await tx.chatMember.create({
		data: {
		chatId: invitation.chatId!,
		userId,
		joinedAt: new Date()
		},
		select: {
		chatMemberId: true,
		chatId: true,
		userId: true,
		joinedAt: true
		}
	});

	await tx.chatRole.create({
		data: {
		chatId: invitation.chatId!,
		userId,
		role: 'member',
		attributedBy: userId
		}
	});

	await tx.chatInvitation.update({
		where: { chatInvitationId },
		data: { status: 'accepted' }
	});

	return member;
	});

	return result;
}

//shared chat infos model
export const chatSelect = {
	chatId: true,
	chatType: true,
	chatName: true,
	createdAt: true,

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

	if (!isMember) {
	throw new AppError('You are not a member of this chat', 403);
	}

	// Fetch chat with full details
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: chatSelect
	});

	if (!chat) {
	throw new AppError('Chat not found', 404);
	}

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
	// {
	// 	chatId: true,
	// 	chatType: true,
	// 	chatName: true,
	// 	createdAt: true,

	// 	creator: {
	// 	select: {
	// 		appUserId: true,
	// 		username: true,
	// 		avatarUrl: true,
	// 		availability: true
	// 	}
	// 	},

	// 	members: {
	// 	select: {
	// 		chatMemberId: true,
	// 		joinedAt: true,
	// 		user: {
	// 		select: {
	// 			appUserId: true,
	// 			username: true,
	// 			avatarUrl: true,
	// 			availability: true
	// 		}
	// 		}
	// 	}
	// 	},

	// 	roles: {
	// 	select: {
	// 		userId: true,
	// 		role: true
	// 	}
	// 	}//maybe should only send group chat name ? See what front thinks
	// }
	});

	return chats;
}

//SEND MESSAGE
export async function sendMessage(chatId: string, userId: string, content: string) {
	// 1. check if chat exists
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: { chatId: true }
	});

	if (!chat) {
		throw new AppError('Chat not found', 404);
	}

	// 2. is user a member
	const member = await prisma.chatMember.findFirst({
	where: { chatId, userId }
	});

	if (!member) {
		throw new AppError('You are not a member of this chat', 403);
	}

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

	if (ban) {
	throw new AppError('You are banned from this chat', 403);
	}

	// 4. Check user role always writting (writer or above)
	const role = await prisma.chatRole.findFirst({
		where: { chatId, userId },
		select: { role: true }
	});
	
	const userRole = role?.role ?? 'member';//check user role, if dont exists, define as member by default
	if (userRole == 'member') {
		throw new AppError('You do not have permission to write in this chat', 403);
	}

	// 4. Create message
	const message = await prisma.chatMessage.create({
	data: {
		chatId,
		userId,
		status: 'posted',
		content
	},
	select: {
		messageId: true,
		chatId: true,
		userId: true,
		content: true,
		status: true,
		postedAt: true
	}
	});

	return message;
}

//DELETE MESSAGE
export async function deleteMessage(messageId: string, userId: string) {
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

	if (!message) {
		throw new AppError('Message not found', 404);
	}

	// 2. Load user role in this chat
	// const role = await prisma.chatRole.findFirst({
	// where: { chatId: message.chatId, userId },
	// select: { role: true }
	// });
	// const userRole = role?.role ?? 'member';
	// const isModeratorOrAbove = ; 
	//NEED to add check if user is moderator

	const isAuthor = message.userId === userId;
	if (!isAuthor /*&& !isModeratorOrAbove*/) {
		throw new AppError('You do not have permission to delete this message', 403);
	}

	// 3. Soft delete
	const updated = await prisma.chatMessage.update({
	where: { messageId },
	data: {
		status: 'deleted',
		deletedAt: new Date()
	},
	select: {
		messageId: true,
		chatId: true,
		status: true,
		deletedAt: true
	}
	});

	return updated;
}

