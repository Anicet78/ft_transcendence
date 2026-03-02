import Type, { type Static } from 'typebox';

export const GameProfileSchema = Type.Object({
  totalGames: Type.Number(),
  totalWins: Type.Number(),
  totalLoses: Type.Number(),
  totalEnemiesKilled: Type.Number(),
  totalXp: Type.Number(),
  level: Type.Number(),
  bestTime: Type.Number()
});
export type GameProfile = Static<typeof GameProfileSchema>;


export const UpdateProfileBodySchema = Type.Object({
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  username: Type.Optional(Type.String()),
  mail: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  avatarUrl: Type.Optional(Type.String()),
  region: Type.Optional(Type.String()),
  availability: Type.Optional(Type.Boolean())
});
export type UpdateProfileBody = Static<typeof UpdateProfileBodySchema>;

export const UpdatePasswordBodySchema = Type.Object({
	oldPassword: Type.String({ minLength: 8 }),
	newPassword: Type.String({ minLength: 8 }),
});

export type UpdatePasswordBody = Static<typeof UpdatePasswordBodySchema>;

export const ProfileResponseSchema = Type.Object({
  appUserId: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  username: Type.String(),
  mail: Type.String(),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  availability: Type.Boolean(),
  region: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  lastConnectedAt: Type.String(),
  gameProfile: Type.Union([GameProfileSchema, Type.Null()])
});
export type ProfileResponse = Static<typeof ProfileResponseSchema>;


export const PublicProfileResponseSchema = Type.Object({
  appUserId: Type.String(),
  username: Type.String(),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  availability: Type.Boolean(),
  playing: Type.Boolean(),
  region: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  gameProfile: Type.Union([GameProfileSchema, Type.Null()]),
  blocked: Type.Boolean()
});
export type PublicProfileResponse = Static<typeof PublicProfileResponseSchema>;


export const ProfileIdParamsSchema = Type.Object({
  id: Type.String()
});
export type ProfileIdParams = Static<typeof ProfileIdParamsSchema>;

export const ProfileUsernameParamsSchema = Type.Object({
  username: Type.String()
});
export type ProfileUsernameParams = Static<typeof ProfileUsernameParamsSchema>;


export const DeleteProfileResponseSchema = Type.Null();

