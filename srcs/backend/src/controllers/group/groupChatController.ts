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
import { prisma } from '../../services/db/prisma.js';

// sendToUser(userId: string, event: string, data: object = {}) {
// 	this.io?.sockets.to(`user:${userId}`).emit(event, data);
// }
//SocketService.sendToUser(receiverId, "notification", {...});

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
	const creatorSocket = req.getSocket()

	if (!creatorId) {
		throw new AppError('Unauthorized', 401);
	}

	const chat = await createGroupChat(creatorId, name ?? null, memberIds);

	const sender = await prisma.appUser.findUnique({
		where: { appUserId: creatorId },
		select: { username: true }
	});

	creatorSocket.join(chat.chatId);

	for (const m of memberIds) {
		const userSocket = await req.server.getSocketByUserId(m);
		if (userSocket) {
			await userSocket.join(chat.chatId);
		}
		SocketService.send(`user:${m}`, "notification", {
			type: "added_to_group",
			creatorId: creatorId,
			creatorName: sender?.username ?? "Companion",
			chatId: chat.chatId,
			chatName: chat?.chatName ?? "Chat"
		});
	}

	SocketService.send(chat.chatId, "chat_created", {});

	return reply.status(201).send(normalizeChat(chat));
}

//DISBAND GROUP CHAT
export async function disbandGroupChatController(
	req: FastifyRequest<{ Params: { chatId: string } }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	if (!userId)
		throw new AppError('Unauthorized', 401);

	const members = await prisma.chatMember.findMany({ 
		where: { chatId: chatId, deletedAt: null}
	})

	if (!members)
		throw new AppError('Members of disbanded chat not found', 401);

	const result = await disbandGroupChat(chatId, userId);

	SocketService.send(chatId, "chat_disbanded", { chatId });
	// for (const m of members) {
	// 	if (!m.userId)
	// 		continue;
	// 	const userSocket = await req.server.getSocketByUserId(m.userId);
	// 	if (userSocket) {
	// 		userSocket.emit("chat_member_quit", { chatId });
	// 		userSocket.leave(chatId);
	// 	}
	// }

	await Promise.all(
		members.map(async (m) => {
			if (!m.userId)
				return;

			const socket = await req.server.getSocketByUserId(m.userId);
			if (!socket)
				return;

			socket.emit("chat_member_quit", { chatId });
			socket.leave(chatId);
		})
	);

	return reply.status(200).send(result);
}

//MEMBER QUITS GROUP CHAT
export async function quitGroupChatController(
  req: FastifyRequest<{ Params: { chatId: string } }>,
  reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	const userSocket = req.getSocket();
	// await SocketService.addInRoom(chatId, socket);

	if (!userId)
		throw new AppError('Unauthorized', 401);

	const result = await quitGroupChat(chatId, userId);

	userSocket.emit("chat_member_quit", { chatId });
	userSocket.leave(chatId);

	SocketService.send(chatId, "chat_member_left", { chatId, userId });

	return reply.status(200).send(result);
}
