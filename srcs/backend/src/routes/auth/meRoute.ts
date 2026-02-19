import { getMeController } from "../../controllers/auth/meController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";

export const MeResponseSchema = Type.Object({
	user: Type.Object({
		id: Type.String(),
		username: Type.String(),
		email: Type.String(),
		role: Type.String()
	}),
	roomId: Type.String()
});
export type MeResponseType = Static<typeof MeResponseSchema>

export async function meRoutes(fastify: FastifyInstance) {

fastify.get("/me", {
	schema: {
		response: {
			200: MeResponseSchema,
			401: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, getMeController);

}
