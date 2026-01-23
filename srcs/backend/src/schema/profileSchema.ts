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
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  lastConnectedAt: Type.String(),
  gameProfile: Type.Union([GameProfileSchema, Type.Null()])
});
export type ProfileResponse = Static<typeof ProfileResponseSchema>;


export const PublicProfileResponseSchema = Type.Object({
  username: Type.String(),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  availability: Type.Boolean(),
  region: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  gameProfile: Type.Union([GameProfileSchema, Type.Null()])
});
export type PublicProfileResponse = Static<typeof PublicProfileResponseSchema>;




// export const GameProfileSchema = Type.Object({
//   gameProfileId: Type.String({ format: 'uuid' }),
//   totalGames: Type.Number(),
//   totalWins: Type.Number(),
//   totalLoses: Type.Number(),
//   totalEnemiesKilled: Type.Number(),
//   totalXp: Type.Number(),
//   level: Type.Number(),
//   bestTime: Type.Optional(Type.Number()),
// });

// export const PrivateProfileSchema = Type.Object({
//   appUserId: Type.String({ format: 'uuid' }),
//   firstName: Type.String(),
//   lastName: Type.String(),
//   username: Type.String(),
//   mail: Type.String(),
//   avatarUrl: Type.Optional(Type.String()),
//   availability: Type.Boolean(),
//   region: Type.String(),
//   createdAt: Type.String({ format: 'date-time' }),
//   gameProfile: Type.Optional(GameProfileSchema),
// });

// export const PublicProfileSchema = Type.Object({
//   username: Type.String(),
//   avatarUrl: Type.Optional(Type.String()),
//   createdAt: Type.String({ format: 'date-time' }),
//   gameProfile: Type.Optional(GameProfileSchema),
// });

// export type PrivateProfile = Static<typeof PrivateProfileSchema>
// export type PublicProfile = Static<typeof PublicProfileSchema>
