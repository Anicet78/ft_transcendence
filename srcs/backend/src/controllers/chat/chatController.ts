import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import { createGroupChat } from '../../services/db/chatService.js';
import type { CreateGroupChatBody } from '../../schema/chatSchema.js';

import { inviteToGroupChat } from '../../services/db/chatService.js';
import type { InviteToGroupParams } from '../../schema/chatSchema.js';

import { acceptGroupInvitation } from '../../services/db/chatService.js';
import type { AcceptInvitationParams } from '../../schema/chatSchema.js';

//CREATE GROUP CHAT
function normalizeChat(chat: any) {
	return {
		chatId: chat.chat_id,
		chatType: chat.chat_type,
		chatName: chat.chat_name,
		createdAt: chat.created_at.toISOString(),
		createdBy: chat.app_user,
		members: chat.chat_member.map((m: any) => {
			const role = chat.chat_role.find((r: any) => r.user_id === m.app_user.appUserId)?.role ?? 'member';
			return {
				chatMemberId: m.chat_member_id,
				joinedAt: m.joined_at.toISOString(),
				role,
				user: m.app_user
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


//INVITATION
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

