import type { FastifyInstance } from "fastify";
import Type, { type Static } from "typebox";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { serverController } from "../../controllers/auth/serverController.js";

export const ServerSchema = Type.Object({
	clientId: Type.String(),
	clientSecret: Type.String()
});
export type ServerType = Static<typeof ServerSchema>;

export const ServerResponseSchema = Type.Object({
	token: Type.String()
});
export type ServerResponseType = Static<typeof ServerResponseSchema>

export async function serverRoutes(fastify: FastifyInstance) {

fastify.post("/server", {
	schema: {
		body: ServerSchema,
		response: {
			200: ServerResponseSchema,
			400: AppErrorSchema,
			401: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, serverController);

}