import type { FastifyInstance } from 'fastify';
import {
	ChatListResponseSchema,
	ChatInfoParamsSchema,
	ChatSchema
} from '../../schema/chat/chatSchema.js';

import {
	listUserChatsController,
	getChatInfoController
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

	//GET USER'S CHATS LIST
	fastify.get('/chat/list', {
		schema: {
		response: {
			200: ChatListResponseSchema
		}
		},
		handler: listUserChatsController
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
