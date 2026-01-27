import Type, { type Static } from 'typebox';

// Shared user preview schema
export const UserPreviewSchema = Type.Object({
  appUserId: Type.String(),
  username: Type.String(),
  avatarUrl: Type.Union([Type.String(), Type.Null()]),
  availability: Type.Optional(Type.Boolean()) // optional because requests don't include it
});
export type UserPreview = Static<typeof UserPreviewSchema>;

// GET /friends response
export const FriendshipSchema = Type.Object({
  friendshipId: Type.String(),
  status: Type.String(),
  createdAt: Type.String(),
  sender: UserPreviewSchema,
  receiver: UserPreviewSchema
});
export type Friendship = Static<typeof FriendshipSchema>;

export const FriendsListResponseSchema = Type.Array(FriendshipSchema);
export type FriendsListResponse = Static<typeof FriendsListResponseSchema>;

// GET /friends/requests response
export const FriendRequestSchema = Type.Object({
  friendshipId: Type.String(),
  status: Type.String(),
  createdAt: Type.String(),
  sender: UserPreviewSchema,
  receiver: UserPreviewSchema
});
export type FriendRequest = Static<typeof FriendRequestSchema>;

export const FriendRequestsListSchema = Type.Array(FriendRequestSchema);
export type FriendRequestsList = Static<typeof FriendRequestsListSchema>;

// POST /friends/:id
export const SendRequestParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' })
});
export type SendRequestParams = Static<typeof SendRequestParamsSchema>;

// PATCH /friends/:id
export const UpdateRequestParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' })
});
export type UpdateRequestParams = Static<typeof UpdateRequestParamsSchema>;

export const UpdateRequestBodySchema = Type.Object({
  action: Type.Union([
    Type.Literal('accept'),
    Type.Literal('reject'),
    Type.Literal('cancel')
  ])
});
export type UpdateRequestBody = Static<typeof UpdateRequestBodySchema>;

// DELETE /friends/:id
export const RemoveFriendParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' })
});
export type RemoveFriendParams = Static<typeof RemoveFriendParamsSchema>;
