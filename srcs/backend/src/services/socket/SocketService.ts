import { type FastifyInstance } from "fastify";
import { Server, Socket } from "socket.io";

export const SocketService = {
	io: null as Server | null,

	init(instance: FastifyInstance): void {
		this.io = instance.io;
	},

	async addInRoom(roomId: string, userSocket: Socket): Promise<void> {
		await userSocket.join(roomId);
	},

	async rmFromRoom(roomId: string, userSocket: Socket): Promise<void> {
		await userSocket.leave(roomId);
	},

	send(receiver: string, event: string, data: object = {}): void {
		this.io?.sockets.to(receiver).emit(event, data);
	}
};
