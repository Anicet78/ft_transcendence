import type { FastifyInstance } from 'fastify';
import {
	InviteToGroupParamsSchema,
	ChatInvitationResponseSchema,

	ChatInvitationListResponseSchema,

	UpdateInvitationParamsSchema,
	ChatMemberResponseSchema,
	InvitationStatusResponseSchema,
	UpdateInvitationBodySchema
} from '../../schema/chat/groupInvitationSchema.js';

import {
	inviteToGroupController,
	listChatInvitationsController,
	updateGroupInvitationController
} from '../../controllers/group/groupInvitationController.js';

async function groupInvitationRoutes(fastify: FastifyInstance) {

	//SEND GROUP CHAT INVITATION
	fastify.post('/group/:chatId/invite/:memberId', {
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
	fastify.post('/group/answer/:chatInvitationId', {
		schema: {
		params: UpdateInvitationParamsSchema,
		body: UpdateInvitationBodySchema,
		response: {
			200: InvitationStatusResponseSchema,
			201: ChatMemberResponseSchema
		}
		},
		handler: updateGroupInvitationController
	});

} export default groupInvitationRoutes;
