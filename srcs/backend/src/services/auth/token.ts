import fs from "fs";
import fastifyJwt from "@fastify/jwt";
import fastify from "../../server.js"

const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();

fastify.register(fastifyJwt, {
	secret: JWT_SECRET,
	sign: { expiresIn: "15m" }
});

export function createAccessToken(payload: {userId: number, email: string}): string {
	return fastify.jwt.sign(payload);
}

export function verifyAccessToken(token: string): {userId: number, email: string} {
	return fastify.jwt.verify(token);
}
