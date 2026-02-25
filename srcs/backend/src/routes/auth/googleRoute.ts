import type { FastifyInstance } from "fastify";
import Type, { type Static } from "typebox";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { googleCallbackController } from "../../controllers/auth/googleController.js";
import { LoginResponseSchema } from "./loginRoute.js";

export const GoogleSchema = Type.Object({
	code: Type.String({ minLength: 10 })
});
export type GoogleType = Static<typeof GoogleSchema>;

export async function googleRoutes(fastify: FastifyInstance) {

fastify.post("/google", {
	schema: {
		body: GoogleSchema,
		response: {
			200: LoginResponseSchema,
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, googleCallbackController);

}
