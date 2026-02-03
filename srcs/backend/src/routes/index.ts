import type { FastifyInstance } from 'fastify';
import { authRouter } from './auth/index.js';
import { profileRoutes } from './profile/profileRoute.js';
import friendshipRoutes from './friendship/friendshipRoute.js';
import { roomRoutes } from './rooms/roomRoute.js';
import chatRoutes from './chat/chatRoute.js';
import chatMessageRoutes from './chat/chatMessageRoute.js';
import groupChatRoutes from './chat/groupChatRoute.js';
import groupInvitationRoutes from './chat/groupInvitationRoute.js';


export async function router(fastify: FastifyInstance) {
	fastify.register(authRouter, { prefix: '/auth' });
	fastify.register(roomRoutes, { prefix: '/room' });
	fastify.register(profileRoutes);
	fastify.register(friendshipRoutes);
	fastify.register(chatRoutes);
	fastify.register(groupChatRoutes);
	fastify.register(chatMessageRoutes);
	fastify.register(groupInvitationRoutes);
}
