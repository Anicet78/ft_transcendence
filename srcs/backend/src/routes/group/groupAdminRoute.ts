import type { FastifyInstance } from 'fastify';
import {
	KickMemberParamsSchema,
	KickMemberResponseSchema,

	UpdateChatRoleParamsSchema,
	UpdateChatRoleBodySchema,
	UpdateChatRoleResponseSchema,

	BanChatMemberParamsSchema,
	BanChatMemberBodySchema,
	BanChatMemberResponseSchema,

	UnbanChatMemberParamsSchema,
	UnbanChatMemberResponseSchema,

	BanListParamsSchema,
	BanListResponseSchema
} from '../../schema/chat/groupAdminSchema.js';

import {
	kickGroupMemberController,
	updateChatMemberRoleController,
	banChatMemberController,
	unbanChatMemberController,
	getChatBansController
} from '../../controllers/group/groupAdminController.js';

async function groupAdminRoutes(fastify: FastifyInstance) {

	//UPDATE CHAT MEMBER ROLES
	fastify.patch('/group/:chatId/role/:memberId', {
		schema: {
		params: UpdateChatRoleParamsSchema,
		body: UpdateChatRoleBodySchema,
		response: {
			200: UpdateChatRoleResponseSchema
		}
	},
	handler: updateChatMemberRoleController
	});

	//KICK MEMBER FROM GROUP CHAT
	fastify.post('/group/:chatId/kick/:memberId', {
		schema: {
			params: KickMemberParamsSchema,
			response: {
				200: KickMemberResponseSchema
		}
		},
		handler: kickGroupMemberController
	});

	//BAN MEMBER FROM GROUP CHAT
	fastify.post('/group/:chatId/ban/:memberId', {
		schema: {
			params: BanChatMemberParamsSchema,
			body: BanChatMemberBodySchema,
			response: {
				200: BanChatMemberResponseSchema
			}
		},
		handler: banChatMemberController
	});

	//UNBAN MEMBER FROM GROUP CHAT
	fastify.patch('/group/:chatId/unban/:memberId', {
		schema: {
			params: UnbanChatMemberParamsSchema,
			response: {
				200: UnbanChatMemberResponseSchema
			}
		},
		handler: unbanChatMemberController
	});

	//LIST CHAT BANS
	fastify.get('/group/:chatId/bans', {
		schema: {
		params: BanListParamsSchema,
		response: {
			200: BanListResponseSchema
		}
		},
		handler: getChatBansController
	});
} export default groupAdminRoutes;
