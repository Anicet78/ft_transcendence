import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import { chat_role_type } from '@prisma/client';

import {
	unbanChatMember,
	kickGroupMember,
	updateGroupMemberRole,
	banChatMember,
	getChatBans
} from '../../services/db/chat/groupAdminService.js';
import { SocketService } from '../../services/socket/SocketService.js';

//KICK MEMBER FROM CHAT
export async function kickGroupMemberController(
	req: FastifyRequest<{ Params: { chatId: string, memberId: string } }>,
	reply: FastifyReply
) {
	const requesterId = req.user.id;
	const { chatId, memberId } = req.params;

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	if (!requesterId)
		throw new AppError('Unauthorized', 401);

	const result = await kickGroupMember(chatId, requesterId, memberId);

	SocketService.send(chatId, "chat_member_kicked", { chatId });

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

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	if (!(Object.values(chat_role_type).includes(role)))
		throw new AppError('Invalid role', 400);

	if (!requesterId)
		throw new AppError('Unauthorized', 401);

	const result = await updateGroupMemberRole(chatId, requesterId, memberId, role);

	SocketService.send(chatId, "chat_member_role_changed", { chatId, userId: memberId, role });

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
