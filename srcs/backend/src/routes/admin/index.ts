import type { FastifyInstance } from "fastify";
import { banRoutes } from "./banRoutes.js";

export async function adminRouter(fastify: FastifyInstance) {
	fastify.register(banRoutes);
}
