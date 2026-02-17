import type { FastifyInstance } from 'fastify';
import { loginRoutes } from './loginRoute.js';
import { registerRoutes } from './registerRoute.js';
import { meRoutes } from './meRoute.js';
import { offlineRoutes } from './offlineRoute.js';
import { refreshRoutes } from './refreshRoute.js';
import { googleRoutes } from './googleRoute.js';

export async function authRouter(fastify: FastifyInstance) {
	fastify.register(meRoutes);
	fastify.register(registerRoutes);
	fastify.register(loginRoutes);
	fastify.register(refreshRoutes);
	fastify.register(offlineRoutes);
	fastify.register(googleRoutes);
}
