import type { FastifyReply, FastifyRequest } from 'fastify';
import {
	sendMessage,
	deleteMessage,
	getChatMessages,
	editMessage,
	moderateMessage,
	restoreMessage,
	chatReceiptsService
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

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

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

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

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

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	const result = await editMessage(chatId, messageId, userId, content);
	SocketService.send(chatId, "chat_message_edited", result);

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

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	const result = await moderateMessage(chatId, messageId, moderatorId);
	SocketService.send(chatId, "chat_message_moderated", {
		...result,
		deletedAt: result.deletedAt?.toISOString() ?? null
	});

	return reply.status(200).send({
		...result,
		deletedAt: result.deletedAt?.toISOString() ?? null
	});
}

//RESTORE MESSAGE
export async function restoreMessageController(
	req: FastifyRequest<{ Params: { chatId: string, messageId: string } }>,
	reply: FastifyReply
){
	const moderatorId = req.user.id;
	const { chatId, messageId } = req.params;

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	const result = await restoreMessage(chatId, messageId, moderatorId);
	SocketService.send(chatId, "chat_message_restored", {
		messageId: result.messageId,
		chatId: result.chatId,
		status: result.status
	});

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
	const { chatId, messageId } = req.params;
	console.log("DELETE controller hit", chatId, messageId);

	const socket = req.getSocket();
	await SocketService.addInRoom(chatId, socket);

	const result = await deleteMessage(chatId, messageId, userId);

	SocketService.send(result.chatId, "chat_message_deleted", result);

	return reply.status(204).send();
}


//RETURN CHAT RECEIPTS
export async function getChatReceiptsController(
	req: FastifyRequest<{ Params: SendMessageParams }>,
	reply: FastifyReply
) {
	const {chatId} = req.params;

	const receipts = await chatReceiptsService(chatId);

	return reply.status(200).send(receipts);
}