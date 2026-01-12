import fs from "fs";
import fastifyJwt from "@fastify/jwt";
import fastify from "../../server.js"

const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();

fastify.register(fastifyJwt, {
	secret: JWT_SECRET,
	sign: { expiresIn: "15m" }
});

/**
 * Create and return the token for a user.
 * @param {{userId: number, email: string}} payload User payload
 * @returns {string} JWT token
 */
export function createAccessToken(payload: {userId: number, email: string}): string {
	return fastify.jwt.sign(payload);
}

/**
 * Check if the token is valid and hasn't expired.
 * @param {string} token JWT token
 * @returns {{userId: number, email: string}} User payload
 */
export function verifyAccessToken(token: string): {userId: number, email: string} {
	return fastify.jwt.verify(token);
}
