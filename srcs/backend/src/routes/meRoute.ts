import { getMeController } from "../controllers/meController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";

export const MeResponseSchema = Type.Object({
	user: Type.Object({
		id: Type.String(),
		email: Type.String()
	})
});
export type MeResponseType = Static<typeof MeResponseSchema>

export async function meRoutes(fastify: FastifyInstance) {

fastify.get("/me", {
	schema: {
		response: {
			200: MeResponseSchema,
			401: Type.String()
		}
	}
}, getMeController);

}
