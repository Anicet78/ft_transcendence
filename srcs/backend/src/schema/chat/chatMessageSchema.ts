import Type, { type Static } from 'typebox';
// import { AppErrorSchema } from './errorSchema.js';
import { UserPreviewSchema } from '../friendshipSchema.js';

//SEND MESSAGE
export const SendMessageParamsSchema = Type.Object({
  chatId: Type.String({ format: 'uuid' })
});
export type SendMessageParams = Static<typeof SendMessageParamsSchema>;


export const SendMessageBodySchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 2000 })//should decide on that later
});
export type SendMessageBody = Static<typeof SendMessageBodySchema>;

export const ChatMessageResponseSchema = Type.Object({
	messageId: Type.String(),
	chatId: Type.String(),
	userId: Type.String(),
	content: Type.String(),
	status: Type.String(),
	postedAt: Type.String()
});

//RETRIEVE CHAT MESSAGES
export const ChatMessageParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});
export type ChatMessagesParams = Static<typeof ChatMessageParamsSchema>;

export const ChatMessageSchema = Type.Object({
  messageId: Type.String(),
  chatId: Type.String(),
  userId: Type.String(),
  content: Type.String(),
  status: Type.String(),
  postedAt: Type.String(),
  editedAt: Type.Union([Type.String(), Type.Null()]),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
  author: UserPreviewSchema
});

export const ChatMessageListSchema = Type.Array(ChatMessageSchema);

//EDIT MESSAGE
export const EditMessageParamsSchema = Type.Object({
  chatId: Type.String({ format: 'uuid' }),
  messageId: Type.String({ format: 'uuid' })
});

export const EditMessageBodySchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 2000 })
});

export const EditMessageResponseSchema = Type.Object({
  messageId: Type.String(),
  chatId: Type.String(),
  userId: Type.String(),
  content: Type.String(),
  status: Type.String(),
  editedAt: Type.String()
});

//MODERATE MESSAGE
export const ModerateMessageParamsSchema = Type.Object({
  chatId: Type.String({ format: 'uuid' }),
  messageId: Type.String({ format: 'uuid' })
});

export const ModerateMessageResponseSchema = Type.Object({
  messageId: Type.String(),
  chatId: Type.String(),
  status: Type.String(),
  deletedAt: Type.String()
});

//RESTORE MESSAGE
export const RestoreMessageParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' }),
	messageId: Type.String({ format: 'uuid' })
});

export const RestoreMessageResponseSchema = Type.Object({
	messageId: Type.String(),
	chatId: Type.String(),
	status: Type.String()
});

//DELETE MESSAGE
export const DeleteMessageParamsSchema = Type.Object({
  chatId: Type.String({ format: 'uuid' }),
  messageId: Type.String({ format: 'uuid' })
});
export type DeleteMessageParams = Static<typeof DeleteMessageParamsSchema>;

export const DeleteMessageResponseSchema = Type.Object({
	messageId: Type.String(),
	chatId: Type.String(),
	status: Type.String(),
	deletedAt: Type.String()
});