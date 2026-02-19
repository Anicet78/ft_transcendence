import Type, { type Static } from 'typebox';
// import { AppErrorSchema } from '../errorSchema.js';
import { UserPreviewSchema } from '../friendshipSchema.js';

//INVITATION
export const InviteToGroupParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' }),
	memberId: Type.String({ format: 'uuid' })
});
export type InviteToGroupParams = Static<typeof InviteToGroupParamsSchema>;

export const ChatInvitationResponseSchema = Type.Object({
	chatInvitationId: Type.String(),
	chatId: Type.String(),
	senderId: Type.String(),//UserPreviewSchema,
	receiverId: Type.String(),//UserPreviewSchema,
	status: Type.String(),
	createdAt: Type.String()
});


//RETURN USER'S CHAT INVITATIONS (send and received)
export const ChatInvitationPreviewSchema = Type.Object({
  chatInvitationId: Type.String(),
  chatId: Type.Union([Type.String(), Type.Null()]),
  status: Type.String(),
  createdAt: Type.String(),

  sender: UserPreviewSchema,
  receiver: UserPreviewSchema,

  chat: Type.Object({
	chatId: Type.String(),
	chatType: Type.String(),
	chatName: Type.Union([Type.String(), Type.Null()])
  })
});

export const ChatInvitationListResponseSchema = Type.Array(ChatInvitationPreviewSchema);


//ANSWER GROUP CHAT INVITATION
export const UpdateInvitationParamsSchema = Type.Object({
	chatInvitationId: Type.String({ format: 'uuid' })
});
export type UpdateInvitationParams = Static<typeof UpdateInvitationParamsSchema>;

export const UpdateInvitationBodySchema = Type.Object({
	action: Type.Union([
		Type.Literal("accept"),
		Type.Literal("reject"),
		Type.Literal("cancel") ])
});
export type UpdateInvitationBody = Static<typeof UpdateInvitationBodySchema>;


export const InvitationStatusResponseSchema = Type.Object({ status: Type.String() });

//in case of "accept", respond with created member
export const ChatMemberResponseSchema = Type.Object({
	chatMemberId: Type.String(),
	chatId: Type.String(),
	userId: Type.String(),
	role: Type.String(),
	joinedAt: Type.String()
});

