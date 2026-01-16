import type { FastifyInstance } from 'fastify';
import { authRouter } from './auth/index.js';

export async function router(fastify: FastifyInstance) {
	fastify.register(authRouter, { prefix: '/auth' });
}
