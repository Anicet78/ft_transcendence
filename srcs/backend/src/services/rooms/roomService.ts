import { AppError } from "../../schema/errorSchema.js";
import type { Room } from "../../schema/roomSchema.js";
import { SocketService } from "../socket/SocketService.js";
import type { Socket } from "socket.io";

const rooms = new Map<string, Room>();

export const RoomService = {
	rooms: rooms as ReadonlyMap<string, Room>,

	async create(userId: string, userSocket: Socket): Promise<Room> {
		let roomId: string = Math.random().toString(36).substring(7).toUpperCase();
		while (rooms.has(roomId))
			roomId = Math.random().toString(36).substring(7).toUpperCase();

		const newRoom: Room = {
			roomId: roomId,
			hostId: userId,
			playersId: [userId]
		};

		rooms.set(roomId, newRoom);

		await SocketService.addInRoom(roomId, userSocket);
		return newRoom;
	},

	find(userId: string): Room | null {
		for (const room of rooms.values()) {
			if (room.playersId.includes(userId)) {
				return room;
			}
		}
		return null;
	},

	findAll(): Array<Room> {
		return Array.from(rooms.values());
	},

	async join(roomId: string, userId: string, userSocket: Socket): Promise<Room> {
		const room = rooms.get(roomId);
		if (!room)
			throw new AppError('Room not found', 404);

		if (room.playersId.includes(userId))
			throw new AppError('Already in room', 409);

		if (room.playersId.length >= 8)
			throw new AppError('Room full', 409);

		await this.leave(userId, userSocket);
		await SocketService.addInRoom(roomId, userSocket);

		room.playersId.push(userId);
		return room;
	},

	async leave(userId: string, userSocket: Socket | null = null, reason: string = "Quit"): Promise<void> {
		for (const [roomId, room] of rooms.entries()) {
			if (room.playersId.includes(userId))
			{
				room.playersId = room.playersId.filter((id: string) => id !== userId);
				if (userSocket)
				{
					await SocketService.rmFromRoom(roomId, userSocket);
					SocketService.send(roomId, "player_left", {
						playerId: userId,
						reason: reason
					});
				}
			}
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
			throw new AppError('Room not found', 404);

		const room: Room | undefined = rooms.get(roomId);
		if (!room)
			throw new AppError('Room not found', 404);

		if (!room.playersId.includes(userId))
			throw new AppError('Not in the room', 403);

		return room;
	}
};