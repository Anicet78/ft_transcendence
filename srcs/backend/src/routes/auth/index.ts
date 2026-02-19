import type { FastifyInstance } from 'fastify';
import { loginRoutes } from './loginRoute.js';
import { registerRoutes } from './registerRoute.js';
import { meRoutes } from './meRoute.js';
import { refreshRoutes } from './refreshRoute.js';
import { googleRoutes } from './googleRoute.js';
import { fortyTwoRoutes } from './fortyTwoRoute.js';

export async function authRouter(fastify: FastifyInstance) {
	fastify.register(meRoutes);
	fastify.register(registerRoutes);
	fastify.register(loginRoutes);
	fastify.register(refreshRoutes);
	fastify.register(googleRoutes);
	fastify.register(fortyTwoRoutes);
}
