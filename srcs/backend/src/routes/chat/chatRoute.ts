import type { FastifyInstance } from 'fastify';
import {
	CreateGroupChatBodySchema,
	CreateGroupChatResponseSchema,
	InviteToGroupParamsSchema,
	ChatInvitationResponseSchema,
	AcceptInvitationParamsSchema,
	ChatMemberResponseSchema,
	ChatListResponseSchema,
	SendMessageParamsSchema,
	SendMessageBodySchema,
	ChatMessageResponseSchema,
	DeleteMessageParamsSchema,
	DeleteMessageResponseSchema
} from '../../schema/chatSchema.js';
import {
	createGroupChatController,
	inviteToGroupController,
	acceptGroupInvitationController,
	listUserChatsController,
	sendMessageController,
	deleteMessageController
} from '../../controllers/chat/chatController.js';

async function chatRoutes(fastify: FastifyInstance) {
	fastify.post('/chat/group/new', {
	schema: {
		body: CreateGroupChatBodySchema,
		response: {
		201: CreateGroupChatResponseSchema
		}
	},
	handler: createGroupChatController
	});

	fastify.post('/group/:chatId/:memberId/invite', {
		schema: {
		params: InviteToGroupParamsSchema,
		response: {
			201: ChatInvitationResponseSchema
		}
		},
		handler: inviteToGroupController
	});

	fastify.post('/group/:chatInvitationId', {
		schema: {
		params: AcceptInvitationParamsSchema,
		response: {
			201: ChatMemberResponseSchema
		}
		},
		handler: acceptGroupInvitationController
	});

	fastify.get('/chat/list', {
		schema: {
		response: {
			200: ChatListResponseSchema
		}
		},
		handler: listUserChatsController
	});

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

	fastify.delete('/chat/:messageId', {
		schema: {
		params: DeleteMessageParamsSchema,
		response: {
			200: DeleteMessageResponseSchema
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
