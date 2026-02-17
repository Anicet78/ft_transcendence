import Type from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { postLogoutController } from "../../controllers/auth/logoutController.js";

const LogoutResponseSchema = Type.Object({
	success: Type.Boolean()
});

export async function logoutRoutes(fastify: FastifyInstance) {

	fastify.post("/logout", {
		schema: {
			response: {
				200: LogoutResponseSchema,
				400: AppErrorSchema,
				401: AppErrorSchema,
				500: AppErrorSchema
			}
		}
	}, postLogoutController);

}
