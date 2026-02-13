import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';
import {
	sendMessage,
	deleteMessage,
	getChatMessages,
	editMessage,
	moderateMessage,
	restoreMessage
} from '../../services/db/chat/chatMessageService.js';

import type {
	SendMessageParams,
	SendMessageBody,
	DeleteMessageParams
} from '../../schema/chat/chatMessageSchema.js';
import { SocketService } from '../../services/socket/SocketService.js';

//SEND MESSAGE
export async function sendMessageController(
	req: FastifyRequest<{ Params: SendMessageParams; Body: SendMessageBody }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;
	const { content } = req.body;

	if (!userId) {
		throw new AppError('Unauthorized', 401);
	}

	const message = await sendMessage(chatId, userId, content);

	SocketService.send(chatId, "chat_message_created", message);

	return reply.status(201).send({
		messageId: message.messageId,
		chatId: message.chatId,
		userId: message.userId,
		content: message.content,
		status: message.status,
		postedAt: message.postedAt?.toISOString() ?? null
	});
}

//RETRIEVE CHAT MESSAGES
export async function getChatMessagesController(
	req: FastifyRequest<{ Params: { chatId: string } }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;

	if (!userId)
		throw new AppError('Unauthorized', 401);

	const messages = await getChatMessages(chatId, userId);

	return reply.status(200).send(
		messages.map(m => ({
			messageId: m.messageId,
			chatId: m.chatId,
			userId: m.userId,
			content: m.content,
			status: m.status,
			postedAt: m.postedAt?.toISOString() ?? null,
			editedAt: m.editedAt?.toISOString() ?? null,
			deletedAt: m.deletedAt?.toISOString() ?? null,
			author: m.author
		}))
	);
}

//EDIT MESSAGE
export async function editMessageController(
	req: FastifyRequest<{ Params: { chatId: string, messageId: string },
							Body: { content: string } }>,
	reply: FastifyReply
){

	const userId = req.user.id;
	const { chatId, messageId } = req.params;
	const { content } = req.body;

	if (!userId) throw new AppError('Unauthorized', 401);

	const result = await editMessage(chatId, messageId, userId, content);

	return reply.status(200).send({
		...result,
		editedAt: result.editedAt?.toISOString() ?? null
	});
}

//MODERATE MESSAGE
export async function moderateMessageController(
	req: FastifyRequest<{ Params: { chatId: string, messageId: string } }>,
	reply: FastifyReply
) {
	const moderatorId = req.user.id;
	const { chatId, messageId } = req.params;

	if (!moderatorId)
		throw new AppError('Unauthorized', 401);

	const result = await moderateMessage(chatId, messageId, moderatorId);

	return reply.status(200).send({
		...result,
		deletedAt: result.deletedAt?.toISOString() ?? null
	});
}

//RESTORE SCHEMA
export async function restoreMessageController(
	req: FastifyRequest<{ Params: { chatId: string, messageId: string } }>,
	reply: FastifyReply
){
	const moderatorId = req.user.id;
	const { chatId, messageId } = req.params;

	if (!moderatorId)
		throw new AppError('Unauthorized', 401);

	const result = await restoreMessage(chatId, messageId, moderatorId);

	return reply.status(200).send({
		messageId: result.messageId,
		chatId: result.chatId,
		status: result.status
	});
}

//DELETE MESSAGE
export async function deleteMessageController(
	req: FastifyRequest<{ Params: DeleteMessageParams }>,
	reply: FastifyReply
) {
	const userId = req.user.id;
	const { messageId } = req.params;

	if (!userId)
		throw new AppError('Unauthorized', 401);

	const result = await deleteMessage(messageId, userId);

	return reply.status(200).send({
		messageId: result.messageId,
		chatId: result.chatId,
		status: result.status,
		deletedAt: result.deletedAt?.toISOString() ?? null
	});
}