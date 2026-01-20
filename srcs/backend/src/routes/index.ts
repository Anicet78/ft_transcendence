import type { FastifyInstance } from 'fastify';
import { authRouter } from './auth/index.js';
import profileRoutes from './profile/profileRoute.js';

export async function router(fastify: FastifyInstance) {
	fastify.register(authRouter, { prefix: '/auth' });
	fastify.register(profileRoutes);
}
