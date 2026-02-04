import type { FastifyInstance } from 'fastify';
import {
	CreateGroupChatBodySchema,
	CreateGroupChatResponseSchema,
	
	DisbandGroupParamsSchema,
	DisbandGroupChatSchema,

	QuitGroupParamsSchema,
	QuitGroupResponseSchema
} from '../../schema/chat/groupChatSchema.js';

import {
	createGroupChatController,
	disbandGroupChatController,
	quitGroupChatController
} from '../../controllers/chat/groupChatController.js';

async function groupChatRoutes(fastify: FastifyInstance) {

	//CREATE GROUP CHAT
	fastify.post('/chat/group/new', {
	schema: {
		body: CreateGroupChatBodySchema,
		response: {
		201: CreateGroupChatResponseSchema
		}
	},
	handler: createGroupChatController
	});

	//DISBAND GROUP CHAT
	fastify.post('/group/:chatId/disband', {
		schema: {
			params: DisbandGroupParamsSchema,
			response: {
				200: DisbandGroupChatSchema,
		}
		},
		handler: disbandGroupChatController
	});

	//QUIT GROUP (need to soft delete)
	fastify.post('/group/:chatId/quit', {
		schema: {
		params: QuitGroupParamsSchema,
		response: {
			200: QuitGroupResponseSchema
		}
		},
		handler: quitGroupChatController
	});

} export default groupChatRoutes;
