import type { FastifyInstance } from "fastify";
import Type, { type Static } from "typebox";
import { AppErrorSchema } from "../schema/errorSchema.js";
import { getRoomController, hostRoomController, joinRoomController, newRoomController } from "../controllers/roomController.js";
import { RoomSchema } from "../schema/roomSchema.js";

export const RoomParamsSchema = Type.Object({
	id: Type.String()
});
export type RoomParamsType = Static<typeof RoomParamsSchema>;

export const RoomBodySchema = Type.Object({
	roomId: Type.String(),
	userId: Type.String()
});
export type RoomBodyType = Static<typeof RoomBodySchema>;

export async function roomRoutes(fastify: FastifyInstance) {

fastify.get("/", {
	schema: {
		params: RoomParamsSchema,
		response: {
			200: RoomSchema,
			500: AppErrorSchema
		}
	}
}, getRoomController);

fastify.get("/new", {
	schema: {
		response: {
			200: RoomSchema,
			500: AppErrorSchema
		}
	}
}, newRoomController);

fastify.get("/join/:id", {
	schema: {
		params: RoomParamsSchema,
		response: {
			200: RoomSchema,
			404: AppErrorSchema,
			409: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, joinRoomController);

fastify.patch("/host", {
	schema: {
		body: RoomBodySchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, hostRoomController);

};
