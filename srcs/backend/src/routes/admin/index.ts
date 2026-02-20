import type { FastifyInstance } from "fastify";
// import { banRoutes } from "./banRoutes.js";

 export async function adminRouter(fastify: FastifyInstance) {
 	fastify.addHook('preHandler', fastify.verifyAdmin);

	// fastify.register(banRoutes);
}
