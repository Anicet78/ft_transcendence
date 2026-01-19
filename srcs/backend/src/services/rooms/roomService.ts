import type { Room } from "../../schema/roomSchema.js";

const rooms = new Map<string, Room>();

export const RoomService = {
	rooms: rooms as ReadonlyMap<string, Room>,

	create(userId: string): Room {
		let roomId: string = Math.random().toString(36).substring(7).toUpperCase();
		while (rooms.has(roomId))
			roomId = Math.random().toString(36).substring(7).toUpperCase();

		const newRoom: Room = {
			roomId: roomId,
			hostId: userId,
			playersId: [userId]
		};

		rooms.set(roomId, newRoom);
		return newRoom;
	},

	findAll(): Array<Room> {
		return Array.from(rooms.values());
	},

	join(roomId: string, userId: string): Room {
		const room = rooms.get(roomId);
		if (!room)
			throw new Error('Room not found');

		if (room.playersId.length >= 8)
			throw new Error('Room full');

		room.playersId.push(userId);
		return room;
	},

	leave(userId: string): void {
		for (const [roomId, room] of rooms.entries()) {
			room.playersId = room.playersId.filter((id: string) => id !== userId);
			if (room.playersId.length === 0) {
				rooms.delete(roomId);
			}
		}
	},

	has(roomId: string): boolean {
		return rooms.has(roomId);
	},

	get(roomId: string, userId: string): Room {
		if (!rooms.has(roomId))
			throw new Error('Room not found');

		const room: Room | undefined = rooms.get(roomId);
		if (!room)
			throw new Error('Room not found');

		if (!room.playersId.includes(userId))
			throw new Error('Not in the room');

		return room;
	}
};