import fastify, { type FastifyInstance } from "fastify";
import { Server } from "socket.io";

export const SocketService = {
	io: null as Server | null,

	init(instance: FastifyInstance): void {
		this.io = instance.io;
	},

	addInRoom(roomId: string, userId: string): void {
		this.io?.socketsJoin(roomId);
	},

	rmFromRoom(roomId: string, userId: string): void {

	},

	send<T>(receiver: string, event: string, data: T): void {

	}
};
