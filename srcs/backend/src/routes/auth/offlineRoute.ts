import Type, { type Static } from "typebox";
import type { FastifyInstance } from "fastify";
import { postOfflineController } from "../../controllers/auth/offlineController.js";
import { AppErrorSchema } from "../../schema/errorSchema.js";

export const OfflineResponseSchema = Type.Object({
	success: Type.Boolean({})
});
export type OfflineResponseType = Static<typeof OfflineResponseSchema>

export async function offlineRoutes(fastify: FastifyInstance) {

fastify.post("/offline", {
	schema: {
		response: {
			200: OfflineResponseSchema,
			400: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, postOfflineController);

}
