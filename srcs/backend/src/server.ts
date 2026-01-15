import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { initAuth } from './services/auth/token.js';
import { loginRoutes } from './routes/loginRoute.js';
import { registerRoutes } from './routes/registerRoute.js';

export const fastify = Fastify({
	logger: true, // active le logging intégré
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

// Démarrage du serveur
const start = async () => {
	try {
		await initAuth(fastify);

		fastify.register(loginRoutes);
		fastify.register(registerRoutes);

		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log('Server running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

await start();
