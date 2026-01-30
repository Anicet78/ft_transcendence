import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import { createGroupChat } from '../../services/db/chatService.js';
import type { CreateGroupChatBody } from '../../schema/chatSchema.js';

import { inviteToGroupChat } from '../../services/db/chatService.js';
import type { InviteToGroupParams } from '../../schema/chatSchema.js';

import { acceptGroupInvitation } from '../../services/db/chatService.js';
import type { AcceptInvitationParams } from '../../schema/chatSchema.js';

import { listUserChats } from '../../services/db/chatService.js';

import { sendMessage } from '../../services/db/chatService.js';
import type { SendMessageParams, SendMessageBody } from '../../schema/chatSchema.js';

import { deleteMessage } from '../../services/db/chatService.js';
import type { DeleteMessageParams } from '../../schema/chatSchema.js';


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

//RETURN USER'S CHAT LIST
export async function listUserChatsController(
	req: FastifyRequest, reply: FastifyReply
) {
	const userId = req.user.id;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const chats = await listUserChats(userId);

	return reply.status(200).send(
	chats.map(normalizeChat) //should rework that to use it everywhere
	);
}

//SEND MESSAGE
export async function sendMessageController(
	req: FastifyRequest<{ Params: SendMessageParams; Body: SendMessageBody }>, reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;
	const { content } = req.body;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const message = await sendMessage(chatId, userId, content);

	return reply.status(201).send({
	messageId: message.messageId,
	chatId: message.chatId,
	userId: message.userId,
	content: message.content,
	status: message.status,
	postedAt: message.postedAt?.toISOString() ?? null
	});
}

//DELETE MESSAGE
export async function deleteMessageController(
	req: FastifyRequest<{ Params: DeleteMessageParams }>,
	reply: FastifyReply
	) {
	const userId = req.user.id;
	const { messageId } = req.params;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await deleteMessage(messageId, userId);

	return reply.status(200).send({
	messageId: result.messageId,
	chatId: result.chatId,
	status: result.status,
	deletedAt: result.deletedAt?.toISOString() ?? null
	});
}


