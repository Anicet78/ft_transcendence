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
  avatarUrl: Type.Optional(Type.String()),
  region: Type.Optional(Type.String()),
  availability: Type.Optional(Type.Boolean())
});
export type UpdateProfileBody = Static<typeof UpdateProfileBodySchema>; 



export const ProfileResponseSchema = Type.Object({
  appUserId: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  username: Type.String(),
  mail: Type.String(),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  availability: Type.Boolean(),
  region: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  lastConnectedAt: Type.String(),
  gameProfile: GameProfileSchema
});
export type ProfileResponse = Static<typeof ProfileResponseSchema>;



export const PublicProfileResponseSchema = Type.Object({
  username: Type.String(),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  availability: Type.Boolean(),
  region: Type.String(),
  createdAt: Type.String(),
  gameProfile: GameProfileSchema
});
export type PublicProfileResponse = Static<typeof PublicProfileResponseSchema>;
