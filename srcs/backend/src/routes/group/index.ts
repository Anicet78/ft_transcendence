import type { FastifyInstance } from 'fastify';
import groupAdminRoutes from './groupAdminRoute.js';
import groupChatRoutes from './groupChatRoute.js';
import groupInvitationRoutes from './groupInvitationRoute.js';

export async function groupRouter(fastify: FastifyInstance) {
	fastify.register(groupAdminRoutes);
	fastify.register(groupChatRoutes);
	fastify.register(groupInvitationRoutes);
}
