import Type, { type Static } from 'typebox';
// import { AppErrorSchema } from '../errorSchema.js';
import { UserPreviewSchema } from '../friendshipSchema.js';

//KICK MEMBER FROM CHAT
export const KickMemberParamsSchema = Type.Object({
  chatId: Type.String({ format: 'uuid' }),
  memberId: Type.String({ format: 'uuid' })
});
export type KickMemberParams = Static<typeof KickMemberParamsSchema>;

export const KickMemberResponseSchema = Type.Object({
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