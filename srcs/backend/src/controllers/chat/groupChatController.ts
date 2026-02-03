import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import { chat_role_type } from '@prisma/client';

import { createGroupChat, unbanChatMember } from '../../services/db/chat/groupChatService.js';
import type { CreateGroupChatBody } from '../../schema/chat/groupChatSchema.js';

import { inviteToGroupChat } from '../../services/db/chat/groupChatService.js';
import type { InviteToGroupParams } from '../../schema/chat/groupChatSchema.js';

import { listUserChatInvitations } from '../../services/db/chat/groupChatService.js';

import { acceptGroupInvitation } from '../../services/db/chat/groupChatService.js';
import type { AcceptInvitationParams } from '../../schema/chat/groupChatSchema.js';

import { disbandGroupChat } from '../../services/db/chat/groupChatService.js';

import { kickGroupMember } from '../../services/db/chat/groupChatService.js';

import { quitGroupChat } from '../../services/db/chat/groupChatService.js';

import { updateGroupMemberRole } from '../../services/db/chat/groupChatService.js';

import { banChatMember, getChatBans } from '../../services/db/chat/groupChatService.js';

//CREATE GROUP CHAT (we're not sending an invite here, members are part of conversation)
function normalizeChat(chat: any) {
	return {
		chatId: chat.chatId,
		chatType: chat.chatType,
		chatName: chat.chatName,
		createdAt: chat.createdAt.toISOString(),
		createdBy: chat.creator,
		members: chat.members.map((m: any) => {
			const role = chat.roles.find((r: any) => r.userId === m.user.appUserId)?.role ?? chat_role_type.member;
			return {
				chatMemberId: m.chatMemberId,
				joinedAt: m.joinedAt.toISOString(),
				role,
				user: m.user
			};
		})
	};
}

export async function createGroupChatController(
	req: FastifyRequest<{ Body: CreateGroupChatBody }>, reply: FastifyReply ) {
	const creatorId = req.user.id;
	const { name, memberIds } = req.body;

	if (!creatorId) {
		throw new AppError('Unauthorized', 401);
	}

	const chat = await createGroupChat(creatorId, name ?? null, memberIds);

	return reply.status(201).send(normalizeChat(chat));
}

//SEND GROUP CHAT INVITATION
export async function inviteToGroupController(
	req: FastifyRequest<{ Params: InviteToGroupParams }>,
	reply: FastifyReply
	) {
	const senderId = req.user.id;
	const { chatId, memberId: receiverId } = req.params;

	if (!senderId) {
	throw new AppError('Unauthorized', 401);
	}

	const invitation = await inviteToGroupChat(chatId, senderId, receiverId);

	return reply.status(201).send({
		chatInvitationId: invitation.chatInvitationId,
		chatId: invitation.chatId,
		senderId: invitation.senderId,
		receiverId: invitation.receiverId,
		status: invitation.status,
		createdAt: invitation.createdAt ? invitation.createdAt.toISOString() : null
	});
}


//RETURN USER'S CHAT INVITATIONS (send and received)
export async function listChatInvitationsController(
	req: FastifyRequest,
	reply: FastifyReply
) {
	const userId = req.user.id;

	if (!userId) {
		throw new AppError('Unauthorized', 401);
	}

	const invitations = await listUserChatInvitations(userId);

	return reply.status(200).send(
	invitations.map(inv => ({
		chatInvitationId: inv.chatInvitationId,
		chatId: inv.chatId,
		status: inv.status,
		createdAt: inv.createdAt?.toISOString() ?? null,
		sender: inv.sender,
		receiver: inv.receiver,
		chat: inv.chat
	}))
	);
}

//ANSWER PENDING GROUP CHAT INVITATION
export async function acceptGroupInvitationController(
	req: FastifyRequest<{ Params: AcceptInvitationParams }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatInvitationId } = req.params;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const member = await acceptGroupInvitation(chatInvitationId, userId);

	return reply.status(201).send({
	chatMemberId: member.chatMemberId,
	chatId: member.chatId,
	userId: member.userId,
	role: chat_role_type.member,
	joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null
	});
}

export async function disbandGroupChatController(
	req: FastifyRequest<{ Params: { chatId: string } }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await disbandGroupChat(chatId, userId);

	return reply.status(200).send(result);
}

//KICK MEMBER FROM CHAT
export async function kickGroupMemberController(
  req: FastifyRequest<{ Params: { chatId: string, memberId: string } }>,
  reply: FastifyReply
) {
  const requesterId = req.user.id;
  const { chatId, memberId } = req.params;

  if (!requesterId) {
    throw new AppError('Unauthorized', 401);
  }

  const result = await kickGroupMember(chatId, requesterId, memberId);

  return reply.status(200).send(result);
}

//MEMBER QUITS GROUP CHAT
export async function quitGroupChatController(
  req: FastifyRequest<{ Params: { chatId: string } }>,
  reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await quitGroupChat(chatId, userId);

	return reply.status(200).send(result);
}

//UPDATE CHAT MEMBER ROLE
export async function updateChatMemberRoleController(
	req: FastifyRequest<{ Params: { chatId: string, memberId: string },
							Body: { role: chat_role_type } }>,
	reply: FastifyReply
) {
	const requesterId = req.user.id;
	const { chatId, memberId } = req.params;
	const { role } = req.body;

	if (!(Object.values(chat_role_type).includes(role))) {
		throw new AppError('Invalid role', 400);
	}

	if (!requesterId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await updateGroupMemberRole(chatId, requesterId, memberId, role);

	return reply.status(200).send(result);
}

//BAN MEMBER FROM GROUP CHAT
export async function banChatMemberController(
	req: FastifyRequest<{ Params: { chatId: string, memberId: string },
							Body: { reason?: string, expiresAt?: string }}>,
	reply: FastifyReply						
){
	const requesterId = req.user.id;
	const { chatId, memberId } = req.params;
	const { reason, expiresAt } = req.body;

	if (!requesterId){
		throw new AppError('Unauthorized', 401);
	}

	const result = await banChatMember(
		chatId,
		requesterId,
		memberId,
		reason ?? null,
		expiresAt ? new Date(expiresAt) : null
	);

	return reply.status(200).send(result);
}

//UNBAN MEMBER FROM GROUP CHAT
export async function unbanChatMemberController(
	req: FastifyRequest<{ Params: { chatId: string, memberId: string}}>,
	reply: FastifyReply
){
	const requesterId = req.user.id;
	const { chatId, memberId } = req.params;

	if (!requesterId){
		throw new AppError('Unauthorized unbanning action', 401);
	}

	const result = await unbanChatMember(chatId, requesterId, memberId);

	return reply.status(200).send(result);

}

//LIST CHAT BANS
export async function getChatBansController(
	req: FastifyRequest<{ Params: { chatId: string } }>,
	reply: FastifyReply
) {
	const requesterId = req.user.id;
	const { chatId } = req.params;

	if (!requesterId) {
	throw new AppError('Unauthorized', 401);
	}

	const bans = await getChatBans(chatId, requesterId);

	return reply.status(200).send(
	bans.map(b => ({
		chatBanId: b.chatBanId,
		reason: b.reason,
		bannedAt: b.bannedAt?.toISOString() ?? null,
		expiresAt: b.expiresAt?.toISOString() ?? null,
		user: b.bannedUser,
		bannedBy: b.bannedByUser
	}))
	);
}

