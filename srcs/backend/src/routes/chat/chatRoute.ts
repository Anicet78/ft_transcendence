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
	ChatInvitationListResponseSchema,
	ChatMessageParamsSchema,
	ChatMessageListSchema,
	EditMessageParamsSchema,
	EditMessageBodySchema,
	EditMessageResponseSchema,
	ModerateMessageParamsSchema,
	ModerateMessageResponseSchema,
	RestoreMessageParamsSchema,
	RestoreMessageResponseSchema
} from '../../schema/chatSchema.js';
import {
	listUserChatsController,
	sendMessageController,
	deleteMessageController,
	getChatInfoController,
	listChatInvitationsController,
	getChatMessagesController,
	editMessageController,
	moderateMessageController,
	restoreMessageController
} from '../../controllers/chat/chatController.js';

import {
	CreateGroupChatBodySchema,
	CreateGroupChatResponseSchema,

	InviteToGroupParamsSchema,
	ChatInvitationResponseSchema,

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
} from '../../schema/groupChatSchema.js';

import {
	createGroupChatController,
	inviteToGroupController,
	acceptGroupInvitationController,
	disbandGroupChatController,
	kickGroupMemberController,
	quitGroupChatController,
	updateChatMemberRoleController,
	banChatMemberController,
	unbanChatMemberController,
	getChatBansController
} from '../../controllers/chat/groupChatController.js';

async function chatRoutes(fastify: FastifyInstance) {
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

	//get infos about one specific chat
	fastify.get('/chat/:chatId/info', {
		schema: {
		params: ChatInfoParamsSchema,
		response: {
			200: ChatSchema
		}
		},
		handler: getChatInfoController
	});

	//get user's chat invitations (send and received)
	fastify.get('/chat/invitations', {
		schema: {
		response: {
			200: ChatInvitationListResponseSchema
		}
		},
		handler: listChatInvitationsController
	});

	//get user's chats list
	fastify.get('/chat/list', {
		schema: {
		response: {
			200: ChatListResponseSchema
		}
		},
		handler: listUserChatsController
	});

	//send message
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

	//DELETE MESSAGE INSIDE CHAT
	fastify.delete('/chat/:messageId', {
		schema: {
		params: DeleteMessageParamsSchema,
		response: {
			204: DeleteMessageResponseSchema
		}
		},
		handler: deleteMessageController
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



	//--------------------- GROUP CHATS ROUTES ---------------------//
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
