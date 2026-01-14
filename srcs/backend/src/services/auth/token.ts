import type { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fs from "fs";

const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();

let fastify: FastifyInstance | null = null;

export async function initAuth(fastifyInstance: any) {
	await fastifyInstance.register(fastifyJwt, {
		secret: JWT_SECRET,
		sign: { expiresIn: "15m" }
	});
	fastify = fastifyInstance;
}

export type JWTPayload = {
	userId: string;
	email: string;
};

/**
 * Create and return the token for a user.
 * @param {{userId: number, email: string}} payload User payload
 * @returns {string} JWT token
 */
export function createAccessToken(payload: JWTPayload): string {
	if (!fastify) throw new Error("Auth not initialized");
	return fastify.jwt.sign(payload);
}

/**
 * Check if the token is valid and hasn't expired.
 * @param {string} token JWT token
 * @returns {{userId: number, email: string}} User payload
 */
export function verifyAccessToken(token: string): JWTPayload {
	if (!fastify) throw new Error("Auth not initialized");
	return fastify.jwt.verify(token);
}
