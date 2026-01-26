import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import socketio from 'fastify-socket.io';
import { Server } from 'socket.io';

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
});

declare module 'fastify' {
	interface FastifyInstance {
		io: Server;
	}
}