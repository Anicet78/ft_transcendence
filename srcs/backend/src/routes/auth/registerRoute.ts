import { postRegisterController } from "../../controllers/auth/registerController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { RegionSchema } from "../../schema/userSchema.js";

export const RegisterSchema = Type.Object({
	firstname: Type.String({ minLength: 1 }),
	lastname: Type.String({ minLength: 1 }),
	username: Type.String({ minLength: 2, maxLength: 20 }),
	region: RegionSchema,
	email: Type.String({ format: 'email', minLength: 3, maxLength: 80 }),
	password: Type.String({ minLength: 8 }),
	socketId: Type.String()
});
export type RegisterType = Static<typeof RegisterSchema>;

export const RegisterResponseSchema = Type.Object({
	token: Type.String(),
	user: Type.Object({
		id: Type.String(),
		email: Type.String()
	}),
	roomId: Type.String()
});
export type RegisterResponseType = Static<typeof RegisterResponseSchema>

export async function registerRoutes(fastify: FastifyInstance) {

fastify.post("/register", {
	schema: {
		body: RegisterSchema,
		response: {
			200: RegisterResponseSchema,
			400: AppErrorSchema,
			409: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, postRegisterController);

}
