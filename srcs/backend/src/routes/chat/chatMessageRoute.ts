import type { FastifyInstance } from 'fastify';
import {
	SendMessageParamsSchema,
	SendMessageBodySchema,
	ChatMessageResponseSchema,
	DeleteMessageParamsSchema,
	DeleteMessageResponseSchema,
	ChatMessageParamsSchema,
	ChatMessageListSchema,
	EditMessageParamsSchema,
	EditMessageBodySchema,
	EditMessageResponseSchema,
	ModerateMessageParamsSchema,
	ModerateMessageResponseSchema,
	RestoreMessageParamsSchema,
	RestoreMessageResponseSchema,
	ChatReceiptsSchema
} from '../../schema/chat/chatMessageSchema.js';

import {
	sendMessageController,
	deleteMessageController,
	getChatMessagesController,
	editMessageController,
	moderateMessageController,
	restoreMessageController,
	getChatReceiptsController
} from '../../controllers/chat/chatMessageController.js';

async function chatMessageRoutes(fastify: FastifyInstance) {
	//SEND MESSAGE
	fastify.post('/chat/:chatId', {
		schema: {
		params: SendMessageParamsSchema,
		body: SendMessageBodySchema,
		response: {
			201: ChatMessageResponseSchema
		}
		},
		handler: sendMessageController
	});

	//GET MESSAGES FROM CHAT
	fastify.get('/chat/:chatId/messages', {
		schema: {
		params: ChatMessageParamsSchema,
		response: {
			200: ChatMessageListSchema
		}
		},
		handler: getChatMessagesController
	});

	//EDIT MESSAGE
	fastify.patch('/chat/:chatId/message/:messageId/edit', {
		schema: {
		params: EditMessageParamsSchema,
		body: EditMessageBodySchema,
		response: { 200: EditMessageResponseSchema }
		},
		handler: editMessageController
	});

	//MODERATE MESSAGE
	fastify.patch('/chat/:chatId/message/:messageId/moderate', {
		schema: {
		params: ModerateMessageParamsSchema,
		response: { 200: ModerateMessageResponseSchema }
		},
		handler: moderateMessageController
	});

	//RESTORE MESSAGE
	fastify.patch('/chat/:chatId/message/:messageId/restore', {
		schema: {
		params: RestoreMessageParamsSchema,
		response: {
			200: RestoreMessageResponseSchema
		}
		},
		handler: restoreMessageController
	});

	//DELETE MESSAGE
	fastify.delete('/chat/:chatId/message/:messageId', {
		schema: {
		params: DeleteMessageParamsSchema,
		response: {
			204: DeleteMessageResponseSchema
		}
		},
		handler: deleteMessageController
	});

	//GET USER'S CHATS LIST
	fastify.get('/chat/:chatId/receipts', {
		schema: {
			params: SendMessageParamsSchema,
			response: {
				200: ChatReceiptsSchema
			}
		},
		handler: getChatReceiptsController
	});

} export default chatMessageRoutes;
