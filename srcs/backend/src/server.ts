import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import errorPlugin from './plugins/error.js';
import authPlugin from './plugins/auth.js';
import socketPlugin from './plugins/socket.js';
import { router } from './routes/index.js';

export const fastify = Fastify({
	logger: true,
	trustProxy: true
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

const start = async () => {
	try {
		fastify.register(errorPlugin);
		fastify.register(authPlugin);
		fastify.register(socketPlugin);
		fastify.register(router);

		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

await start();
