import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import { chat_role_type } from '@prisma/client';

import {
	createGroupChat,
	disbandGroupChat,
	quitGroupChat
} from '../../services/db/chat/groupChatService.js';

import type {
	CreateGroupChatBody
} from '../../schema/chat/groupChatSchema.js';
import { SocketService } from '../../services/socket/SocketService.js';

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

//DISBAND GROUP CHAT
export async function disbandGroupChatController(
	req: FastifyRequest<{ Params: { chatId: string } }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await disbandGroupChat(chatId, userId);

	SocketService.send(chatId, "chat_disbanded", { chatId }); 

	return reply.status(200).send(result);
}

//MEMBER QUITS GROUP CHAT
export async function quitGroupChatController(
  req: FastifyRequest<{ Params: { chatId: string } }>,
  reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await quitGroupChat(chatId, userId);

	SocketService.send(chatId, "chat_member_left", { chatId, userId });

	return reply.status(200).send(result);
}
