import type { FastifyInstance } from 'fastify';
import { authRouter } from './auth/index.js';
import { profileRoutes } from './profile/profileRoute.js';
import friendshipRoutes from './friendship/friendshipRoute.js';
import { roomRoutes } from './rooms/roomRoute.js';
import { adminRouter } from './admin/index.js';

export async function router(fastify: FastifyInstance) {
	fastify.register(authRouter, { prefix: '/auth' });
	fastify.register(roomRoutes, { prefix: '/room' });
	fastify.register(profileRoutes);
	fastify.register(friendshipRoutes);
	fastify.register(adminRouter, { prefix: '/admin', preHandler: fastify.verifyAdmin });
}
