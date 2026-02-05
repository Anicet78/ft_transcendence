import type { FastifyInstance } from 'fastify';
import chatRoutes from './chatRoute.js';
import chatMessageRoutes from './chatMessageRoute.js';

export async function chatRouter(fastify: FastifyInstance) {
	fastify.register(chatRoutes);
	fastify.register(chatMessageRoutes);
}
