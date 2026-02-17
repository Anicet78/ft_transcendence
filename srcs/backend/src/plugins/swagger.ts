import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
	await fastify.register(fastifySwagger, {
		openapi: {
			info: { title: 'Transcendence Backend API', version: '1.0.0' },
		}
	});

	await fastify.register(fastifySwaggerUi, {
		routePrefix: '/documentation',
		uiConfig: {
			docExpansion: 'full',
			deepLinking: false
		},
	});
});
