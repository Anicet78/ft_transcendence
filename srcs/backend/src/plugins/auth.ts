import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import fs from "fs";
import type { FastifyReply, FastifyRequest } from "fastify";

export type JWTPayload = {
	id: string;
	email: string;
};

export default fp(async (fastify) => {
	const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();

	await fastify.register(fastifyJwt, {
		secret: JWT_SECRET,
		sign: { expiresIn: "15m" }
	});

	fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			request.log.error(err);
			reply.code(401).send({ error: "Not authenticated" });
		}
	});

	fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
		const currentRoute = request.routeOptions.url;

		const publicRoutes = ['/auth/register', '/auth/login', '/'];

		if (currentRoute && publicRoutes.includes(currentRoute)) return;

		try {
			await request.jwtVerify();
		} catch (err) {
			request.log.error(err);
			return reply.code(401).send({ error: "Not authenticated" });
		}
	});
});

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			id: string;
			email: string;
		}
	}
}

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}
