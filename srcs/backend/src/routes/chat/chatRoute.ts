import type { FastifyInstance } from 'fastify';
import {
	ChatListResponseSchema,
	SendMessageParamsSchema,
	SendMessageBodySchema,
	ChatMessageResponseSchema,
	DeleteMessageParamsSchema,
	DeleteMessageResponseSchema,
	ChatInfoParamsSchema,
	ChatSchema,
	// ChatInvitationListResponseSchema,
	ChatMessageParamsSchema,
	ChatMessageListSchema,
	EditMessageParamsSchema,
	EditMessageBodySchema,
	EditMessageResponseSchema,
	ModerateMessageParamsSchema,
	ModerateMessageResponseSchema,
	RestoreMessageParamsSchema,
	RestoreMessageResponseSchema
} from '../../schema/chat/chatSchema.js';
import {
	listUserChatsController,
	sendMessageController,
	deleteMessageController,
	getChatInfoController,
	// listChatInvitationsController,
	getChatMessagesController,
	editMessageController,
	moderateMessageController,
	restoreMessageController
} from '../../controllers/chat/chatController.js';

async function chatRoutes(fastify: FastifyInstance) {
	//GET CHAT INFOS + ACCESS CHAT
	fastify.get('/chat/:chatId/info', {
		schema: {
		params: ChatInfoParamsSchema,
		response: {
			200: ChatSchema
		}
		},
		handler: getChatInfoController
	});

	// //GET USER'S INVITATION (send and received)
	// fastify.get('/group/invitations', {
	// 	schema: {
	// 	response: {
	// 		200: ChatInvitationListResponseSchema
	// 	}
	// 	},
	// 	handler: listChatInvitationsController
	// });

	//GET USER'S CHATS LIST
	fastify.get('/chat/list', {
		schema: {
		response: {
			200: ChatListResponseSchema
		}
		},
		handler: listUserChatsController
	});

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

	//GET MESSAGED FROM CHAT
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
	fastify.delete('/chat/:messageId', {
		schema: {
		params: DeleteMessageParamsSchema,
		response: {
			204: DeleteMessageResponseSchema
		}
		},
		handler: deleteMessageController
	});

} export default chatRoutes;


// curl -X POST http://localhost:3000/chat/group/new \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
//   -d '{
//     "name": "My first group",
//     "memberIds": [
//       "UUID_OF_USER_1",
//       "UUID_OF_USER_2"
//     ]
//   }'
