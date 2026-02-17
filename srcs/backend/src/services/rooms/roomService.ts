import { AppError } from "../../schema/errorSchema.js";
import type { Room } from "../../schema/roomSchema.js";
import type { RequestUser } from "../../schema/userSchema.js";
import { SocketService } from "../socket/SocketService.js";
import type { Socket } from "socket.io";

const rooms = new Map<string, Room>();

export const RoomService = {
	rooms: rooms as ReadonlyMap<string, Room>,

	async create(user: RequestUser, userSocket: Socket): Promise<Room> {
		let roomId: string = Math.random().toString(36).substring(7).toUpperCase();
		while (rooms.has(roomId))
			roomId = Math.random().toString(36).substring(7).toUpperCase();

		const newRoom: Room = {
			roomId: roomId,
			hostId: user.id,
			players: [{ id: user.id, username: user.username }]
		};

		rooms.set(roomId, newRoom);

		await SocketService.addInRoom(roomId, userSocket);
		return newRoom;
	},

	find(userId: string): Room | null {
		for (const room of rooms.values()) {
			if (room.players.map(players => players.id).includes(userId)) {
				return room;
			}
		}
		return null;
	},

	findAll(): Array<Room> {
		return Array.from(rooms.values());
	},

	async join(roomId: string, user: RequestUser, userSocket: Socket): Promise<Room> {
		const room = rooms.get(roomId);
		if (!room)
			throw new AppError('Room not found', 404);

		if (room.players.map(players => players.id).includes(user.id))
			throw new AppError('Already in room', 409);

		if (room.players.length >= 8)
			throw new AppError('Room full', 409);

		await this.leave(user.id, userSocket);
		await SocketService.addInRoom(roomId, userSocket);

		SocketService.send(roomId, "player_joined", {
			playerId: user.id,
			playerUsername: user.username
		});

		room.players.push({ id: user.id, username: user.username });
		return room;
	},

	async leave(userId: string, userSocket: Socket | null = null, reason: string = "Quit"): Promise<void> {
		for (const [roomId, room] of rooms.entries()) {
			if (room.players.map(players => players.id).includes(userId))
			{
				room.players = room.players.filter(players => players.id !== userId);
				if (userSocket)
				{
					await SocketService.rmFromRoom(roomId, userSocket);
					SocketService.send(roomId, "player_left", {
						playerId: userId,
						reason: reason
					});
				}
			}
			if (room.players.length === 0) {
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

		if (!room.players.map(players => players.id).includes(userId))
			throw new AppError('Not in the room', 403);

		return room;
	}
};