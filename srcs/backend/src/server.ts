import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const fastify = Fastify({
	logger: true, // active le logging intégré
});

fastify.withTypeProvider<TypeBoxTypeProvider>();

// Démarrage du serveur
const start = async () => {
	try {
		// register routes here
		await fastify.listen({ port: 3000 });
		console.log('Server running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();

export default fastify;
