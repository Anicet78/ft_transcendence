import Type, { type Static } from 'typebox';
import { AppErrorSchema } from '../errorSchema.js';
import { UserPreviewSchema } from '../friendshipSchema.js';

//GROUP CREATION
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

//DISBAND GROUP CHAT
export const DisbandGroupParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});
export type DisbandGroupParams = Static<typeof DisbandGroupParamsSchema>;

export const DisbandGroupChatSchema = Type.Object({
	chatId: Type.String(),
	deletedAt: Type.String()
});


//MEMBER QUITS GROUP CHAT
export const QuitGroupParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});

export const QuitGroupResponseSchema = Type.Object({
	success: Type.Boolean()
});
