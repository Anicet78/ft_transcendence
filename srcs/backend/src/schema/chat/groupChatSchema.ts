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


// //INVITATION
// export const InviteToGroupParamsSchema = Type.Object({
// 	chatId: Type.String({ format: 'uuid' }),
// 	memberId: Type.String({ format: 'uuid' })
// });
// export type InviteToGroupParams = Static<typeof InviteToGroupParamsSchema>;

// export const ChatInvitationResponseSchema = Type.Object({
// 	chatInvitationId: Type.String(),
// 	chatId: Type.String(),
// 	senderId: Type.String(),//UserPreviewSchema,
// 	receiverId: Type.String(),//UserPreviewSchema,
// 	status: Type.String(),
// 	createdAt: Type.String()
// });


// //RETURN USER'S CHAT INVITATIONS (send and received)
// export const ChatInvitationPreviewSchema = Type.Object({
//   chatInvitationId: Type.String(),
//   chatId: Type.Union([Type.String(), Type.Null()]),
//   status: Type.String(),
//   createdAt: Type.String(),

//   sender: UserPreviewSchema,
//   receiver: UserPreviewSchema,

//   chat: Type.Object({
// 	chatId: Type.String(),
// 	chatType: Type.String(),
// 	chatName: Type.Union([Type.String(), Type.Null()])
//   })
// });
// export const ChatInvitationListResponseSchema = ChatInvitationPreviewSchema;


// //ANSWER GROUP CHAT INVITATION
// export const AcceptInvitationParamsSchema = Type.Object({
// 	chatInvitationId: Type.String({ format: 'uuid' })
// });
// export type AcceptInvitationParams = Static<typeof AcceptInvitationParamsSchema>;

// export const ChatMemberResponseSchema = Type.Object({
// 	chatMemberId: Type.String(),
// 	chatId: Type.String(),
// 	userId: Type.String(),
// 	role: Type.String(),
// 	joinedAt: Type.String()
// });

//DISBAND GROUP CHAT
export const DisbandGroupParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});
export type DisbandGroupParams = Static<typeof DisbandGroupParamsSchema>;

export const DisbandGroupChatSchema = Type.Object({
	chatId: Type.String(),
	deletedAt: Type.String()
});

//KICK MEMBER FROM CHAT
export const KickMemberParamsSchema = Type.Object({
  chatId: Type.String({ format: 'uuid' }),
  memberId: Type.String({ format: 'uuid' })
});
export type KickMemberParams = Static<typeof KickMemberParamsSchema>;

export const KickMemberResponseSchema = Type.Object({
  success: Type.Boolean()
});

//MEMBER QUITS GROUP CHAT
export const QuitGroupParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});

export const QuitGroupResponseSchema = Type.Object({
	success: Type.Boolean()
});

//UPDATE MEMBER ROLE INSIDE GROUP CHAT
export const UpdateChatRoleParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' }),
	memberId: Type.String({ format: 'uuid' })
});

export const UpdateChatRoleBodySchema = Type.Object({
	role: Type.Union([
		Type.Literal('owner'),
		Type.Literal('admin'),
		Type.Literal('moderator'),
		Type.Literal('writer'),
		Type.Literal('member')
	])
});

export const UpdateChatRoleResponseSchema = Type.Object({
	success: Type.Boolean()
});

//BAN MEMBER FROM GROUP CHAT
export const BanChatMemberParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' }),
	memberId: Type.String({ format: 'uuid' })
});

export const BanChatMemberBodySchema = Type.Object({
	reason: Type.Optional(Type.String({ maxLength: 200 })),
	expiresAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export const BanChatMemberResponseSchema = Type.Object({
	success: Type.Boolean()
});

//UNBAN MEMBER FROM GROUP CHAT
export const UnbanChatMemberParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' }),
	memberId: Type.String({ format: 'uuid' })
});

export const UnbanChatMemberResponseSchema = Type.Object({
	success: Type.Boolean()
});

//LIST CHAT BANS
export const BanListParamsSchema = Type.Object({
	chatId: Type.String({ format: 'uuid' })
});

export const BanListResponseSchema = Type.Object({
	chatBanId: Type.String(),
	user: UserPreviewSchema,
	bannedBy: UserPreviewSchema,
	reason: Type.Union([Type.String(), Type.Null()]),
	bannedAt: Type.String({ format: 'date-time' }),
	expiresAt: Type.Union([ Type.String(), Type.Null() ])
});