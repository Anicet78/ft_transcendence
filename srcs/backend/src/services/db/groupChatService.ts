import { prisma } from './prisma.js';
import { chat_role_type } from '@prisma/client';
import { AppError } from '../../schema/errorSchema.js';
import {
	ROLE_RANK,
	getRoleRank/*,
	type ChatRole */} from '../../utils/chatRoles.js';


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
				role: userId === creatorId ? 'owner' : 'member',
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
	// if (chat.deletedAt !== null) {
	// 	throw new AppError('This chat has been disbanded', 410);
	// }
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

	// if (invitation.chatId.deletedAt !== null) {
	// 	throw new AppError('This chat has been disbanded and invitation is no longer available', 410);
	// }

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


//KICKMEMBER FROM CHAT
export async function kickGroupMember(chatId: string, requesterId: string, targetId: string) {
	// 1. Load chat
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: {
		chatId: true,
		chatType: true
	}
	});

	if (!chat) {
	throw new AppError('Chat not found', 404);
	}

	if (chat.chatType !== 'group') {
	throw new AppError('Only group chats support kicking members', 400);
	}

	// 2. Check requester is a member
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});

	if (!requesterMember) {
	throw new AppError('You are not a member of this group', 403);
	}

	// 3. Check target is a member
	const targetMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});

	if (!targetMember) {
	throw new AppError('Target user is not a member of this group', 404);
	}

	// 4. Load roles
	const requesterRole = await prisma.chatRole.findFirst({
	where: { chatId, userId: requesterId },
	select: { role: true }
	});

	const targetRole = await prisma.chatRole.findFirst({
	where: { chatId, userId: targetId },
	select: { role: true }
	});

	const roleRank = {
		owner: 5,
		admin: 4,
		moderator: 3,
		writer: 2,
		member: 1
	};//make it a global enum (Nina)

	const requesterRank = roleRank[requesterRole?.role ?? 'member'];
	const targetRank = roleRank[targetRole?.role ?? 'member'];

	// 5. Permission check
	if (requesterRank < roleRank['moderator']) {
	throw new AppError('You do not have permission to kick members', 403);
	}

	if (requesterRank <= targetRank) {
	throw new AppError('You cannot kick a member with equal or higher role', 403);
	}

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

//UPDATE CHAT MEMBER ROLER
export async function updateGroupMemberRole( chatId: string, requesterId: string, targetId: string, newRole: string
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

	if (!chat) {
		throw new AppError('Chat not found', 404);
	}

	if (chat.chatType !== 'group') {
		throw new AppError('Only group chats support role changes', 400);
	}

	// 2. Check requester membership
	const requesterMember = await prisma.chatMember.findFirst({
	where: { chatId, userId: requesterId, deletedAt: null }
	});

	if (!requesterMember) {
		throw new AppError('You are not a member of this group', 403);
	}

	// 3. Check target membership
	const targetMember = await prisma.chatMember.findFirst({
	where: { chatId, userId: targetId, deletedAt: null }
	});

	if (!targetMember) {
		throw new AppError('Target user is not a member of this group', 404);
	}

	// 4. Load roles
	const requesterRole = await prisma.chatRole.findFirst({
	where: { chatId, userId: requesterId, deletedAt: null },
	select: { role: true }
	});

	const targetRole = await prisma.chatRole.findFirst({
	where: { chatId, userId: targetId, deletedAt: null },
	select: { role: true }
	});

	const roleRank = {
		owner: 5,
		admin: 4,
		moderator: 3,
		writer: 2,
		member: 1
	};

	const requesterRank = roleRank[requesterRole?.role ?? 'member'];
	const targetRank = roleRank[targetRole?.role ?? 'member'];

	type RoleName = keyof typeof roleRank;
	const newRank = roleRank[newRole as RoleName];

	// 5. Permission checks
	if (requesterRank < roleRank['admin']) {
	throw new AppError('Only admins or owners can change roles', 403);
	}

	if (targetId === chat.createdBy) {
	throw new AppError('You cannot change the owner’s role', 403);
	}

	if (requesterRank <= targetRank) {
	throw new AppError('You cannot modify a member with equal or higher role', 403);
	}

	if (newRank >= requesterRank) {
	throw new AppError('You cannot assign a role equal or higher than your own', 403);
	}

	// 6. Apply role change
	await prisma.chatRole.updateMany({
	where: { chatId, userId: targetId },
	data: {
		role: newRole as chat_role_type,
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

	if (!chat) {
		throw new AppError('Chat not found', 404);
	}

	if (chat.chatType !== 'group') {
		throw new AppError('Banning private group chat members is not possible', 400);
	}

	//2. Check that requester is a chat member (should I allow plateform admin to be abble to ban members ?)
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});
	if (!requesterMember) {
		throw new AppError('You are not a member of this group', 403);
	}

	//3. Check that targeted user is a chat member
	const targetMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});
	if (!targetMember) {
		throw new AppError('Target');
	}

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

	if (requesterRank < ROLE_RANK.moderator) {
		throw new AppError('You do not have permission to ban members', 403);
	}
	if (targetId == chat.createdBy) {
		throw new AppError('You cannot ban the owner', 403);
	}
	if (requesterRank <= targetRank) {
		throw new AppError('You cannot ban a member with equal or higher role', 403);
	}

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

	if (!chat){
		throw new AppError('Chat not found', 404);
	}

	if (chat.chatType !== 'group') {
		throw new AppError('Banning private group chat members is not possible', 400);
	}

	//2. Check that requester is a chat member (should I allow plateform admin to be abble to ban members ?)
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});
	if (!requesterMember) {
		throw new AppError('You are not a member of this group', 403);
	}

	//3. Check that targeted user is a chat member
	const targetMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});
	if (!targetMember) {
		throw new AppError('Target');
	}

	//4. Check if target is banned
	const isBan = await prisma.chatBan.findFirst({
		where: {
			chatId,
			userId: targetId,
			deletedAt: null
		}
	});
	if (!isBan){
		throw new AppError('This user is not banned', 404);
	}

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

	if (requesterRank < ROLE_RANK.moderator) {
		throw new AppError('You do not have permission to unban members', 403);
	}

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

	if (!chat) {
		throw new AppError('Chat not found', 404);
	}

	if (chat.chatType !== 'group') {
		throw new AppError('Only group chats support bans', 400);
	}

	//2. Check that requester is a chat member
	const requesterMember = await prisma.chatMember.findFirst({
		where: {
			chatId,
			userId: requesterId,
			deletedAt: null
		}
	});
	if (!requesterMember) {
		throw new AppError('You are not a member of this group', 403);
	}

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

	if (requesterRank < ROLE_RANK.moderator) {
		throw new AppError('You do not have permission to view bans', 403);
	}

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


