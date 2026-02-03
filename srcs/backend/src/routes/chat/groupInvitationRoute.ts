import type { FastifyInstance } from 'fastify';
import {
	InviteToGroupParamsSchema,
	ChatInvitationResponseSchema,

	ChatInvitationListResponseSchema,

	AcceptInvitationParamsSchema,
	ChatMemberResponseSchema
} from '../../schema/chat/groupInvitationSchema.js';

import {
	inviteToGroupController,
	listChatInvitationsController,
	acceptGroupInvitationController
} from '../../controllers/chat/groupInvitationController.js';

async function groupInvitationRoutes(fastify: FastifyInstance) {

	//SEND GROUP CHAT INVITATION
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

	//ANSWER GROUP CHAT INVITATION
	fastify.post('/group/:chatInvitationId', {
		schema: {
		params: AcceptInvitationParamsSchema,
		response: {
			201: ChatMemberResponseSchema
		}
		},
		handler: acceptGroupInvitationController
	});

} export default groupInvitationRoutes;
