import { postRefreshController } from "../../controllers/auth/refreshController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";

export const RefreshResponseSchema = Type.Object({
	token: Type.String(),
	user: Type.Object({
		id: Type.String(),
		email: Type.String(),
		role: Type.String()
	}),
});
export type RefreshResponseType = Static<typeof RefreshResponseSchema>

export async function refreshRoutes(fastify: FastifyInstance) {

fastify.post("/refresh", {
	schema: {
		response: {
			200: RefreshResponseSchema,
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, postRefreshController);

}
