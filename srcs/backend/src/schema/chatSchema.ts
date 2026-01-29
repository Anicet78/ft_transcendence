import Type, { type Static } from 'typebox';
import { AppErrorSchema } from './errorSchema.js';
import { UserPreviewSchema } from './friendshipSchema.js';

//GROUP CERATION
export const CreateGroupChatBodySchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  memberIds: Type.Array(
    Type.String({ format: 'uuid' }),
    { minItems: 1, uniqueItems: true }
  )
});
export type CreateGroupChatBody = Static<typeof CreateGroupChatBodySchema>;

export const ChatMemberSchema = Type.Object({
  chatMemberId: Type.String(),
  user: UserPreviewSchema,
  role: Type.String(),
  joinedAt: Type.String()
});

export const ChatSchema = Type.Object({
  chatId: Type.String(),
  chatType: Type.String(),
  chatName: Type.Union([Type.String(), Type.Null()]),
  createdBy: UserPreviewSchema,
  createdAt: Type.String(),
  members: Type.Array(ChatMemberSchema)
});
export type Chat = Static<typeof ChatSchema>;

export const CreateGroupChatResponseSchema = ChatSchema;

export const CreateGroupChatErrorSchema = AppErrorSchema;


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


//ANSWER GROUP CHAT INVITATION
export const AcceptInvitationParamsSchema = Type.Object({
	chatInvitationId: Type.String({ format: 'uuid' })
});
export type AcceptInvitationParams = Static<typeof AcceptInvitationParamsSchema>;

export const ChatMemberResponseSchema = Type.Object({
	chatMemberId: Type.String(),
	chatId: Type.String(),
	userId: Type.String(),
	role: Type.String(),
	joinedAt: Type.String()
});
