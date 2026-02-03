import type { FastifyInstance } from 'fastify';
import {
	CreateGroupChatBodySchema,
	CreateGroupChatResponseSchema,

	InviteToGroupParamsSchema,
	ChatInvitationResponseSchema,

	ChatInvitationListResponseSchema,

	AcceptInvitationParamsSchema,
	ChatMemberResponseSchema,
	
	DisbandGroupParamsSchema,
	DisbandGroupChatSchema,

	KickMemberParamsSchema,
	KickMemberResponseSchema,

	QuitGroupParamsSchema,
	QuitGroupResponseSchema,

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
} from '../../schema/chat/groupChatSchema.js';

import {
	createGroupChatController,
	inviteToGroupController,
	listChatInvitationsController,
	acceptGroupInvitationController,
	disbandGroupChatController,
	kickGroupMemberController,
	quitGroupChatController,
	updateChatMemberRoleController,
	banChatMemberController,
	unbanChatMemberController,
	getChatBansController
} from '../../controllers/chat/groupChatController.js';

async function groupChatRoutes(fastify: FastifyInstance) {
	//create group chat
	fastify.post('/chat/group/new', {
	schema: {
		body: CreateGroupChatBodySchema,
		response: {
		201: CreateGroupChatResponseSchema
		}
	},
	handler: createGroupChatController
	});

	//send group chat invitation
	fastify.post('/group/:chatId/:memberId/invite', {
		schema: {
		params: InviteToGroupParamsSchema,
		response: {
			201: ChatInvitationResponseSchema
		}
		},
		handler: inviteToGroupController
	});

	//GET USER'S INVITATION (send and received)
	fastify.get('/group/invitations', {
		schema: {
		response: {
			200: ChatInvitationListResponseSchema
		}
		},
		handler: listChatInvitationsController
	});

	//answer group chat invitation
	fastify.post('/group/:chatInvitationId', {
		schema: {
		params: AcceptInvitationParamsSchema,
		response: {
			201: ChatMemberResponseSchema
		}
		},
		handler: acceptGroupInvitationController
	});

	//DISBAND GROUP CHAT
	fastify.post('/group/:chatId/disband', {
		schema: {
			params: DisbandGroupParamsSchema,
			response: {
				200: DisbandGroupChatSchema,
				// 200: Type.Object({ success: Type.Boolean() }),
		}
		},
		handler: disbandGroupChatController
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
} export default groupChatRoutes;
