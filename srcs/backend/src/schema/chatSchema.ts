import Type, { type Static } from 'typebox';
// import { AppErrorSchema } from './errorSchema.js';
import { UserPreviewSchema } from './friendshipSchema.js';

// //GROUP CREATION
// export const CreateGroupChatBodySchema = Type.Object({
//   name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
//   memberIds: Type.Array(
//     Type.String({ format: 'uuid' }),
//     { minItems: 1, uniqueItems: true }
//   )
// });
// export type CreateGroupChatBody = Static<typeof CreateGroupChatBodySchema>;

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
export const ChatInvitationListResponseSchema = ChatInvitationPreviewSchema;


//RETURN USER'S CHATS LIST
export const ChatListResponseSchema = Type.Array(ChatSchema);
export type ChatListResponse = Static<typeof ChatListResponseSchema>;

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

//DELETE MESSAGE
export const DeleteMessageParamsSchema = Type.Object({
	messageId: Type.String({ format: 'uuid' })
});
export type DeleteMessageParams = Static<typeof DeleteMessageParamsSchema>;

export const DeleteMessageResponseSchema = Type.Object({
	messageId: Type.String(),
	chatId: Type.String(),
	status: Type.String(),
	deletedAt: Type.String()
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