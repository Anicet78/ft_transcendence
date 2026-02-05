import type { FastifyPluginCallback, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import socketio from 'fastify-socket.io';
import { Server, Socket } from 'socket.io';
import { SocketService } from "../services/socket/SocketService.js";
import { AppError } from "../schema/errorSchema.js";

type SocketIOOptions = {
	cors?: {
		origin: string | string[];
		methods?: string[];
	};
};

export default fp(async (fastify) => {
	await fastify.register(socketio as unknown as FastifyPluginCallback<SocketIOOptions>, {
		cors: {
			origin: "*", // will be changed to frontend URL later
			methods: ["GET", "POST", "OPTIONS"]
	}
	});

	SocketService.init(fastify);

	fastify.decorateRequest('getSocket', function (this: FastifyRequest): Socket {
		const socketId = this.headers['x-socket-id'] as string;
		const socket = this.server.io.sockets.sockets.get(socketId);

		if (!socket)
			throw new AppError('Socket connection not found', 404);

		return socket;
	});
});

declare module 'fastify' {
	interface FastifyInstance {
		io: Server;
	}
	interface FastifyRequest {
		getSocket(): Socket;
	}
}
