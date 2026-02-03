import { prisma } from '../prisma.js';
import { chat_role_type } from '@prisma/client';
import { AppError } from '../../../schema/errorSchema.js';
// import {
// 	ROLE_RANK,
// 	getRoleRank/*,
// 	type ChatRole */} from '../../../utils/chatRoles.js';


//GROUP CREATION
export async function createGroupChat(
	creatorId: string, 
	name: string | null, 
	memberIds: string[]
) {
	const uniqueMembers = Array.from(new Set([...memberIds, creatorId]));

	const chat = await prisma.chat.create({
	data: {
		chatType: 'group',
		chatName: name,
		createdBy: creatorId,

		// 1. create chat members
		members: {
		create: uniqueMembers.map((userId) => ({
			userId,
			joinedAt: new Date()
			}))
		},

		//2. create roles rows for all chat members
		roles: {
			create: uniqueMembers.map((userId) => ({
				userId,
				role: userId === creatorId ? chat_role_type.owner : chat_role_type.member,
				attributedBy: creatorId
			}))
		}
	},
	// 3. Return full chat info
	select: {
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
	}
	});
	return chat;
}

//DISBAND GROUP CHAT
export async function disbandGroupChat(chatId: string, userId: string) {
	// 1. Load chat
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: {
		chatId: true,
		chatType: true,
		createdBy: true
	}
	});

	if (!chat) {
	throw new AppError('Chat not found', 404);
	}

	// 2. Must be a group
	if (chat.chatType !== 'group') {
	throw new AppError('Only group chats can be disbanded', 400);
	}

	// 3. Only owner can disband
	if (chat.createdBy !== userId) {
	throw new AppError('Only the group owner can disband this chat', 403);
	}

	// 4. Soft-delete everything in a transaction
	const now = new Date();

	const result = await prisma.$transaction(async (tx) => {
	// Soft-delete chat
	await tx.chat.update({
		where: { chatId },
		data: { deletedAt: now }
	});

	// Soft-delete members
	await tx.chatMember.updateMany({
		where: { chatId },
		data: { deletedAt: now }
	});

	// Soft-delete roles
	await tx.chatRole.updateMany({
		where: { chatId },
		data: { deletedAt: now }
	});

	// Soft-delete pending invitations
	await tx.chatInvitation.updateMany({
		where: { chatId, status: 'waiting' },
		data: { deletedAt: now, status: 'cancelled' }
	});

	// need some work: soft-delete messges
	// await tx.chatMessage.updateMany({
	//   where: { chatId },
	//   data: { status: 'deleted', deletedAt: now }
	// });
	});

	return result;//{ success: true };
}

//MEMBER QUITS CHAT GROUP
export async function quitGroupChat(chatId: string, userId: string) {
	// 1. Load chat
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: {
		chatId: true,
		chatType: true,
		createdBy: true
	}
	});

	if (!chat) {
		throw new AppError('Chat not found', 404);
	}

	if (chat.chatType !== 'group') {
		throw new AppError('Only group chats support quitting', 400);
	}

	// 2. Check membership
	const member = await prisma.chatMember.findFirst({
	where: { chatId, userId, deletedAt: null }
	});

	if (!member) {
		throw new AppError('You are not a member of this group', 403);
	}

	// 3. Owners cannot quit
	if (chat.createdBy === userId) {
		throw new AppError('The owner cannot quit the group. You must disband it instead.', 403);
	}

	const now = new Date();

	// 4. Soft-delete membership + role
	await prisma.$transaction(async (tx) => {
	await tx.chatMember.updateMany({
		where: { chatId, userId },
		data: { deletedAt: now, leftAt: now }
	});

	await tx.chatRole.updateMany({
		where: { chatId, userId },
		data: { deletedAt: now }
	});
	});

	return { success: true };
}
