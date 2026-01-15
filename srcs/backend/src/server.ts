import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import authPlugin from './plugins/auth.js';
import { loginRoutes } from './routes/loginRoute.js';
import { registerRoutes } from './routes/registerRoute.js';
import { meRoutes } from './routes/meRoute.js';

export const fastify = Fastify({
	logger: true, // active le logging intégré
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

// Démarrage du serveur
const start = async () => {
	try {
		fastify.register(authPlugin);

		fastify.register(loginRoutes);
		fastify.register(registerRoutes);
		fastify.register(meRoutes);

		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

await start();
