import type { FastifyInstance } from "fastify";
import Type, { type Static } from "typebox";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { fortyTwoCallbackController } from "../../controllers/auth/fortyTwoController.js";
import { LoginResponseSchema } from "./loginRoute.js";

export const FortyTwoSchema = Type.Object({
	code: Type.String({ minLength: 10 })
});
export type FortyTwoType = Static<typeof FortyTwoSchema>;

export async function fortyTwoRoutes(fastify: FastifyInstance) {

fastify.post("/42", {
	schema: {
		body: FortyTwoSchema,
		response: {
			200: LoginResponseSchema,
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, fortyTwoCallbackController);

}
