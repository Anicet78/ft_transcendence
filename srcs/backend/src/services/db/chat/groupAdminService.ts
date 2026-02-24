import { prisma } from '../prisma.js';
import { chat_role_type } from '@prisma/client';
import { AppError } from '../../../schema/errorSchema.js';
import {
	ROLE_RANK,
	getRoleRank/*,
	type ChatRole */} from '../../../utils/chatRoles.js';

//KICK MEMBER FROM CHAT
export async function kickGroupMember(chatId: string, requesterId: string, targetId: string) {
	// 1. Load chat
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: {
			chatId: true,
			chatType: true
		}
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	if (chat.chatType !== 'group')
		throw new AppError('Only group chats support kicking members', 400);

	// 2. Check requester is a member
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});

	if (!requesterMember)
		throw new AppError('You are not a member of this group', 403);

	// 3. Check target is a member
	const targetMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});

	if (!targetMember)
		throw new AppError('Target user is not a member of this group', 404);

	// 4. Load roles
	const requesterRole = await prisma.chatRole.findFirst({
		where: {
			chatId,
			userId:
			requesterId
		},
		select: { role: true }
	});

	const targetRole = await prisma.chatRole.findFirst({
		where: { chatId, userId: targetId },
		select: { role: true }
	});

	const requesterRank = getRoleRank(requesterRole?.role);
	const targetRank = getRoleRank(targetRole?.role);

	// 5. Permission check
	if (requesterRank < ROLE_RANK.moderator)
		throw new AppError('You do not have permission to kick members', 403);

	if (requesterRank <= targetRank)
		throw new AppError('You cannot kick a member with equal or higher role', 403);

	const now = new Date();

	// 6. Soft-delete membership + role
	await prisma.$transaction(async (tx) => {
		await tx.chatMember.updateMany({
			where: {
				chatId,
				userId: targetId
			},
			data: { deletedAt: now }
		});

		await tx.chatRole.updateMany({
			where: { chatId, userId: targetId },
			data: { deletedAt: now }
		});
	});

	return { success: true };
}

//UPDATE CHAT MEMBER ROLER
export async function updateGroupMemberRole(
	chatId: string,
	requesterId: string,
	targetId: string,
	newRole: chat_role_type
) {
	// 1. Load chat
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: {
			chatId: true,
			chatType: true,
			createdBy: true
		}
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	if (chat.chatType !== 'group')
		throw new AppError('Only group chats support role changes', 400);

	// 2. Check requester membership
	const requesterMember = await prisma.chatMember.findFirst({
		where: { chatId, userId: requesterId, deletedAt: null }
	});

	if (!requesterMember)
		throw new AppError('You are not a member of this group', 403);

	// 3. Check target membership
	const targetMember = await prisma.chatMember.findFirst({
		where: { chatId, userId: targetId, deletedAt: null }
	});

	if (!targetMember)
		throw new AppError('Target user is not a member of this group', 404);

	// 4. Load roles
	const requesterRole = await prisma.chatRole.findFirst({
		where: { chatId, userId: requesterId, deletedAt: null },
		select: { role: true }
	});

	const targetRole = await prisma.chatRole.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null },
		select: { role: true }
	});

	const requesterRank = getRoleRank(requesterRole?.role);
	const targetRank = getRoleRank(targetRole?.role);

	const newRank = ROLE_RANK[newRole];

	// 5. Permission checks
	if (requesterRank < ROLE_RANK.admin)
		throw new AppError('Only admins or owners can change roles', 403);

	if (targetId === chat.createdBy)
		throw new AppError('You cannot change the owner’s role', 403);

	if (requesterRank <= targetRank)
		throw new AppError('You cannot modify a member with equal or higher role', 403);

	if (newRank >= requesterRank)
		throw new AppError('You cannot assign a role equal or higher than your own', 403);

	// 6. Apply role change
	await prisma.chatRole.updateMany({
		where: { chatId, userId: targetId },
		data: {
			role: newRole,
			modifiedAt: new Date()
		}
	});

	return { success: true };
}

//BAN MEMBER FROM GROUP CHAT
export async function banChatMember(
	chatId: string,
	requesterId: string,
	targetId: string,
	reason: string | null,
	expiresAt: Date | null
){
	//1. Load chat
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: {
			chatId: true,
			chatType: true,
			createdBy: true
		}
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	if (chat.chatType !== 'group')
		throw new AppError('Banning private group chat members is not possible', 400);

	//2. Check that requester is a chat member (should I allow plateform admin to be abble to ban members ?)
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});
	if (!requesterMember)
		throw new AppError('You are not a member of this group', 403);

	//3. Check that targeted user is a chat member
	const targetMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});
	if (!targetMember)
		throw new AppError('Target');

	//4. check that requester roles allows banning other members
	const requesterRole = await prisma.chatRole.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		},
		select: { role: true}
	});

	const targetRole = await prisma.chatRole.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		},
		select: { role: true}
	});

	const requesterRank = getRoleRank(requesterRole?.role);
	const targetRank = getRoleRank(targetRole?.role);

	if (requesterRank < ROLE_RANK.moderator)
		throw new AppError('You do not have permission to ban members', 403);
	if (targetId == chat.createdBy)
		throw new AppError('You cannot ban the owner', 403);
	if (requesterRank <= targetRank)
		throw new AppError('You cannot ban a member with equal or higher role', 403);

	//6. Apply ban + remove membership + remove role (temp or permanent)
	const now = new Date();

	await prisma.$transaction(async (tx) => {
		//soft-delete membership
		await tx.chatMember.updateMany({
			where: { chatId, userId: targetId },
			data: { deletedAt: now, leftAt:now } //fill leftAt only if permanent ban
		});

		//soft-delete role
		await tx.chatRole.updateMany({
			where: { chatId, userId: targetId },
			data: { deletedAt: now }
		});

		//create ban row
		await tx.chatBan.create({
			data: {
				chatId,
				userId: targetId,
				bannedBy: requesterId,
				bannedAt: now,
				reason: reason ?? null,
				expiresAt: expiresAt ?? null
			}
		});
	});

	return { success: true };
}

//UNBAN MEMBER FROM GROUP CHAT
export async function unbanChatMember(
	chatId: string,
	requesterId: string,
	targetId: string
){
	//1. Load chat
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: {
			chatId: true,
			chatType: true,
			createdBy: true
		}
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	if (chat.chatType !== 'group')
		throw new AppError('Banning private group chat members is not possible', 400);

	//2. Check that requester is a chat member (should I allow plateform admin to be abble to ban members ?)
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});
	if (!requesterMember)
		throw new AppError('You are not a member of this group', 403);

	//3. Check that targeted user is a chat member
	const targetMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});
	if (!targetMember)
		throw new AppError('Target');

	//4. Check if target is banned
	const isBan = await prisma.chatBan.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});
	if (!isBan)
		throw new AppError('This user is not banned', 404);

	//5. check that requester roles allows banning other members
	const requesterRole = await prisma.chatRole.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		},
		select: { role: true}
	});

	const requesterRank = getRoleRank(requesterRole?.role);

	if (requesterRank < ROLE_RANK.moderator)
		throw new AppError('You do not have permission to unban members', 403);

	//6. soft-delete the ban
	await prisma.chatBan.update({
		where: { 
			chatBanId: isBan.chatBanId},
			data: { deletedAt: new Date() }
	});

	return { success: true };
}

//LIST CHAT BANS
export async function getChatBans(chatId: string, requesterId: string) {
	// 1. Load chat
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: {
		chatId: true,
		chatType: true
	}
	});

	if (!chat)
		throw new AppError('Chat not found', 404);

	if (chat.chatType !== 'group')
		throw new AppError('Only group chats support bans', 400);

	//2. Check that requester is a chat member
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});
	if (!requesterMember)
		throw new AppError('You are not a member of this group', 403);

	// 3. check requester role
	const requesterRole = await prisma.chatRole.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		},
		select: { role: true}
	});

	const requesterRank = getRoleRank(requesterRole?.role);

	if (requesterRank < ROLE_RANK.moderator)
		throw new AppError('You do not have permission to view bans', 403);

	// 4. retrieve active bans
	const bans = await prisma.chatBan.findMany({
	where: {
		chatId,
		deletedAt: null
	},
	orderBy: { bannedAt: 'desc' },
	select: {
		chatBanId: true,
		bannedAt: true,
		reason: true,
		expiresAt: true,

		bannedUser: {
		select: {
			appUserId: true,
			username: true,
			avatarUrl: true,
			availability: true
		}
		},

		bannedByUser: {
		select: {
			appUserId: true,
			username: true,
			avatarUrl: true,
			availability: true
		}
		}
	}
	});

	return bans;
}
