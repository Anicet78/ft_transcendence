import fastifyJwt from "@fastify/jwt";
import fs from "fs";

const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();

let fastify: any = null;

export async function initAuth(fastifyInstance: any) {
	await fastifyInstance.register(fastifyJwt, {
		secret: JWT_SECRET,
		sign: { expiresIn: "15m" }
	});
	fastify = fastifyInstance;
}

export function createAccessToken(payload: {userId: string, email: string}): string {
	if (!fastify) throw new Error("Auth not initialized (call initAuth)");
	return fastify.jwt.sign(payload);
}

export function verifyAccessToken(token: string): {userId: string, email: string} {
	if (!fastify) throw new Error("Auth not initialized (call initAuth)");
	return fastify.jwt.verify(token);
}
