import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import authPlugin from './plugins/auth.js';
import socketPlugin from './plugins/socket.js';
import { router } from './routes/index.js';
import fastifyCors from '@fastify/cors';

export const fastify = Fastify({
	logger: true,
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

const start = async () => {
	try {
		await fastify.register(fastifyCors, {origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], credentials: true});
		fastify.register(authPlugin);
		fastify.register(socketPlugin);
		fastify.register(router);

		await fastify.listen({ port: 3001, host: '0.0.0.0' });
		console.log('Server running on http://localhost:3001');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

await start();
