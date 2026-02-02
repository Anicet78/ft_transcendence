import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';

import { createGroupChat } from '../../services/db/groupChatService.js';
import type { CreateGroupChatBody } from '../../schema/groupChatSchema.js';

import { inviteToGroupChat } from '../../services/db/groupChatService.js';
import type { InviteToGroupParams } from '../../schema/groupChatSchema.js';

import { acceptGroupInvitation } from '../../services/db/groupChatService.js';
import type { AcceptInvitationParams } from '../../schema/groupChatSchema.js';

import { disbandGroupChat } from '../../services/db/groupChatService.js';

import { kickGroupMember } from '../../services/db/groupChatService.js';

import { quitGroupChat } from '../../services/db/groupChatService.js';

import { updateGroupMemberRole } from '../../services/db/groupChatService.js';


//CREATE GROUP CHAT (we're not sending an invite here, members are part of conversation)
function normalizeChat(chat: any) {
	return {
		chatId: chat.chatId,
		chatType: chat.chatType,
		chatName: chat.chatName,
		createdAt: chat.createdAt.toISOString(),
		createdBy: chat.creator,
		members: chat.members.map((m: any) => {
			const role = chat.roles.find((r: any) => r.userId === m.user.appUserId)?.role ?? 'member';
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
	role: 'member',
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
	req: FastifyRequest<{ Params: { chatId: string, memberId: string }, Body: { role: string } }>,
	reply: FastifyReply
) {
	const requesterId = req.user.id;
	const { chatId, memberId } = req.params;
	const { role } = req.body;

	if (!requesterId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await updateGroupMemberRole(chatId, requesterId, memberId, role);

	return reply.status(200).send(result);
}
