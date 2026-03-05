import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import { chat_role_type } from '@prisma/client';

import {
	inviteToGroupChat,
	listUserChatInvitations,
	updateGroupInvitationService
} from '../../services/db/chat/groupInvitationService.js';

import type {
	InviteToGroupParams,
	UpdateInvitationParams,
	UpdateInvitationBody
} from '../../schema/chat/groupInvitationSchema.js';
import { SocketService } from '../../services/socket/SocketService.js';
import { prisma } from '../../services/db/prisma.js';

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

	const chat = await prisma.chat.findUnique({
		where: { chatId: chatId },
		select: { chatName: true }
	});
	const sender = await prisma.appUser.findUnique({
		where: { appUserId: senderId },
		select: { username: true }
	});

	SocketService.send(`user:${receiverId}`, "notification", {
		type: "invite_received",
		senderId: senderId,
		senderName: sender?.username ?? "Companion",
		receiverId: receiverId,
		chatId: chatId,
		chatName: chat?.chatName ?? "Chat"
	});

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
export async function updateGroupInvitationController(
	req: FastifyRequest<{
		Params: UpdateInvitationParams;
		Body: UpdateInvitationBody;
	}>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatInvitationId } = req.params;
	const { action } = req.body; //accept, reject or cancel

	const result = await updateGroupInvitationService(chatInvitationId, userId, action);

	if ( action === "accept") {

		const member = result as {
			chatMemberId: string;
			chatId: string;
			userId: string;
			joinedAt: Date;
			senderId: string;
			chatName: string;
			receiverName: string;
		};

		const socket = await req.server.getSocketByUserId(member.userId);
		if (socket)
			socket.join(member.chatId);

		SocketService.send(member.chatId, "chat_member_joined", { chatId: member.chatId, member });

		SocketService.send(`user:${member.senderId}`, "notification", {
			type: "invite_accepted",
			chatName: member.chatName,
			receiverName: member.receiverName
		});

		return reply.status(201).send({
			chatMemberId: member.chatMemberId,
			chatId: member.chatId,
			userId: member.userId,
			role: chat_role_type.member,
			joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null
		});
	}
	//reject or cancel
	return reply.status(200).send(result);
}
