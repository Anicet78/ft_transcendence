import Fastify from 'fastify';

const fastify = Fastify({
	logger: true, // active le logging intégré
});

// Démarrage du serveur
const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
		console.log('Server running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();

export default fastify;