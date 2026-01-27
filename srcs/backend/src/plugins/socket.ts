import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import socketio from 'fastify-socket.io';
import { Server } from 'socket.io';
import { SocketService } from "../services/socket/SocketService.js";

type SocketIOOptions = {
	cors?: {
		origin: string | string[];
		methods?: string[];
	};
};

export default fp(async (fastify) => {
	await fastify.register(socketio as unknown as FastifyPluginCallback<SocketIOOptions>, {
		cors: {
			origin: "*", // url du frontend plus tard
			methods: ["GET", "POST"]
	}
	});

	SocketService.init(fastify);
});

declare module 'fastify' {
	interface FastifyInstance {
		io: Server;
	}
}