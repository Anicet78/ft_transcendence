/* import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { banController, unbanController } from "../../controllers/admin/banController.js";

export const LoginSchema = Type.Object({
	email: Type.String({ format: 'email', minLength: 3, maxLength: 80 }),
	password: Type.String({ minLength: 8 })
});
export type LoginType = Static<typeof LoginSchema>;

export const LoginResponseSchema = Type.Object({
	token: Type.String(),
	user: Type.Object({
		id: Type.String(),
		email: Type.String()
	}),
	roomId: Type.String()
});
export type LoginResponseType = Static<typeof LoginResponseSchema>

export async function banRoutes(fastify: FastifyInstance) {

fastify.post("/:id/ban", {
	schema: {
		body: LoginSchema,
		response: {
			200: LoginResponseSchema,
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, banController);

fastify.post("/:id/unban", {
	schema: {
		body: LoginSchema,
		response: {
			200: LoginResponseSchema,
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, unbanController);

}
 */