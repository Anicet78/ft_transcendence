import Type, { type Static } from 'typebox';

export const RoomSchema = Type.Object({
	roomId: Type.String(),
	hostId: Type.String(),
	playersId: Type.Array(Type.String())
});

export type Room = Static<typeof RoomSchema>
