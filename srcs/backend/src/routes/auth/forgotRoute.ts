import { forgotPasswordController } from "../../controllers/auth/forgotController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";

export const ForgotSchema = Type.Object({
	email: Type.String({ format: 'email', minLength: 3, maxLength: 80 }),
});
export type ForgotType = Static<typeof ForgotSchema>;

export async function forgotRoutes(fastify: FastifyInstance) {

fastify.post("/forgot-password", {
	schema: {
		body: ForgotSchema,
		response: {
			204: Type.Null(),
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, forgotPasswordController);

}
