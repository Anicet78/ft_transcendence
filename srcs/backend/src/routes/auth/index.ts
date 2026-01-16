import type { FastifyInstance } from 'fastify';
import { loginRoutes } from './loginRoute.js';
import { registerRoutes } from './registerRoute.js';
import { meRoutes } from './meRoute.js';

export async function authRouter(fastify: FastifyInstance) {
	fastify.register(loginRoutes);
	fastify.register(registerRoutes);
	fastify.register(meRoutes);
}
