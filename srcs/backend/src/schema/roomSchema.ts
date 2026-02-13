import Type, { type Static } from 'typebox';

export const RoomSchema = Type.Object({
	roomId: Type.String(),
	hostId: Type.String(),
	players: Type.Array(Type.Object({ id: Type.String(), username: Type.String()}))
});

export type Room = Static<typeof RoomSchema>
