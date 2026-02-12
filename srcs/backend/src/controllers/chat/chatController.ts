import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';

import {
	getChatByIdForUser,
	listUserChats
} from '../../services/db/chat/chatService.js';

import type { ChatInfoParams } from '../../schema/chat/chatSchema.js';

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

//RETURN CHAT INFOS
export async function getChatInfoController(
	req: FastifyRequest<{ Params: ChatInfoParams }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	if (!userId) {
		throw new AppError('Unauthorized', 401);
	}

	const chat = await getChatByIdForUser(chatId, userId);

	return reply.status(200).send(normalizeChat(chat));
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
	return reply.send(chats.map(normalizeChat));
}
