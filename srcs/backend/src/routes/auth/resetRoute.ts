import { resetPasswordController } from "../../controllers/auth/resetController.js";
import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { AppErrorSchema } from "../../schema/errorSchema.js";

export const ResetSchema = Type.Object({
	token: Type.String({  minLength: 32, maxLength: 32 }),
	newPassword: Type.String({
		pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
	})
});
export type ResetType = Static<typeof ResetSchema>;

export async function resetRoutes(fastify: FastifyInstance) {

fastify.post("/reset-password", {
	schema: {
		body: ResetSchema,
		response: {
			204: Type.Null(),
			400: AppErrorSchema,
			401: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, resetPasswordController);

}
