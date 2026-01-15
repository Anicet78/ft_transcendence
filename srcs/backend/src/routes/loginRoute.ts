import { postLoginController } from "../controllers/loginController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";

export const LoginSchema = Type.Object({
	email: Type.String({ format: 'email', minLength: 3, maxLength: 80 }),
	password: Type.String({ minLength: 8 })
});
export type LoginType = Static<typeof LoginSchema>;

export const LoginResponseSchema = Type.Object({
	token: Type.String(),
	user: Type.Object({
		email: Type.String()
	})
});
export type LoginResponseType = Static<typeof LoginResponseSchema>

export async function loginRoutes(fastify: FastifyInstance) {

fastify.post("/login", {
	schema: {
		body: LoginSchema,
		response: {
			200: LoginResponseSchema,
			400: Type.String(),
			401: Type.String(),
			500: Type.String()
		}
	}
}, postLoginController);

}
