import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import fs from "fs";
import type { FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import cookies from "@fastify/cookie";
import type { RequestUser } from "../schema/userSchema.js";

export default fp(async (fastify) => {
	// CORS
	await fastify.register(fastifyCors, {
		origin: ["https://localhost:8443", "http://localhost:5173"],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		credentials: true
	});

	// Authentication
	const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();
	const COOKIE_SECRET = fs.readFileSync("/run/secrets/cookie_secret", "utf8").trim();

	await fastify.register(fastifyJwt, {
		secret: JWT_SECRET,
		sign: { expiresIn: "15min" }
	});

	await fastify.register(cookies, {
		secret: COOKIE_SECRET,
		parseOptions: {}
	});

	fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await request.jwtVerify();
		} catch {
			return reply.code(401).send({ error: "Not authenticated" });
		}
	});

	fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
		// Skip auth for static files
		if (request.url.startsWith('/uploads')) {
			return; // do nothing, allow access
		}
		const currentRoute = request.routeOptions.url;

		const publicRoutes = [
			'/auth/register',
			'/auth/login',
			'/auth/refresh',
			'/auth/42',
			'/auth/google',
			'/auth/forgot-password',
			'/auth/reset-password',
			'/documentation/json',
			'/'
		];

		if (currentRoute && publicRoutes.includes(currentRoute)) return;

		await fastify.authenticate(request, reply);
	});

	// Authorization
	fastify.decorate("verifyAdmin", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		if (!user || user.role !== 'admin')
			return reply.code(403).send({ error: "Forbidden", message: "Not Admin" });
	});
});

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: RequestUser
	}
}

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		verifyAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}
