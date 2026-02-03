import Type, { type Static } from 'typebox';
// import { AppErrorSchema } from './errorSchema.js';
import { UserPreviewSchema } from '../friendshipSchema.js';

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

// export const CreateGroupChatErrorSchema = AppErrorSchema;

//RETURN CHAT INFOS
export const ChatInfoParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});
export type ChatInfoParams = Static<typeof ChatInfoParamsSchema>;

//RETURN USER'S CHATS LIST
export const ChatListResponseSchema = Type.Array(ChatSchema);
export type ChatListResponse = Static<typeof ChatListResponseSchema>;
