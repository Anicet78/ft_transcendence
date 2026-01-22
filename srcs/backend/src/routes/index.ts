import type { FastifyInstance } from 'fastify';
import { authRouter } from './auth/index.js';
import { profileRoutes } from './profile/profileRoute.js';
import friendshipRoutes from './friendship/friendshipRoute.js';

export async function router(fastify: FastifyInstance) {
	fastify.register(authRouter, { prefix: '/auth' });
	fastify.register(profileRoutes);
	fastify.register(friendshipRoutes);
}
