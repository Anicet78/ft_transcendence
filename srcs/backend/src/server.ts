import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import errorPlugin from './plugins/error.js';
import authPlugin from './plugins/auth.js';
import socketPlugin from './plugins/socket.js';
import { router } from './routes/index.js';
import swagger from './plugins/swagger.js';
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

export const fastify = Fastify({
	logger: true,
	trustProxy: true
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

const start = async () => {
	try {
		await fastify.register(swagger);
		await fastify.register(errorPlugin);
		await fastify.register(authPlugin);
		await fastify.register(socketPlugin);
		// Serve uploads folder
		await fastify.register(fastifyStatic, {
			root: '/app/uploads',
			prefix: "/uploads/",
		});
		// Register multipart support
		await fastify.register(multipart, {
			limits: { fileSize: 5_000_000 } // 5MB max
		});
		await fastify.register(router);

		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

await start();
