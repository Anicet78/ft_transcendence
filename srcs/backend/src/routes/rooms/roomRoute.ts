import type { FastifyInstance } from "fastify";
import Type, { type Static } from "typebox";
import { AppErrorSchema } from "../../schema/errorSchema.js";
import { getMyRoomController, getRoomController, hostRoomController, joinRoomController, kickRoomController, launchController, newRoomController, quitRoomController, verifyRoomController } from "../../controllers/rooms/roomController.js";
import { RoomSchema } from "../../schema/roomSchema.js";
import { GlobalHeadersSchema } from "../../schema/globalHeadersSchema.js";

export const RoomParamsSchema = Type.Object({
	id: Type.String()
});
export type RoomParamsType = Static<typeof RoomParamsSchema>;

export const RoomBodySchema = Type.Object({
	userId: Type.String()
});
export type RoomBodyType = Static<typeof RoomBodySchema>;

export async function roomRoutes(fastify: FastifyInstance) {

fastify.get("/:id", {
	schema: {
		params: RoomParamsSchema,
		response: {
			200: RoomSchema,
			403: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, getRoomController);

fastify.get("/me", {
	schema: {
		headers: GlobalHeadersSchema,
		response: {
			200: RoomSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, getMyRoomController);

fastify.post("/new", {
	schema: {
		headers: GlobalHeadersSchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, newRoomController);

fastify.post("/:id/join", {
	schema: {
		headers: GlobalHeadersSchema,
		params: RoomParamsSchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			404: AppErrorSchema,
			409: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, joinRoomController);

fastify.post("/:id/quit", {
	schema: {
		headers: GlobalHeadersSchema,
		params: RoomParamsSchema,
		response: {
			204: Type.Null(),
			400: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, quitRoomController);

fastify.post("/:id/host", {
	schema: {
		params: RoomParamsSchema,
		body: RoomBodySchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			403: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, hostRoomController);

fastify.post("/:id/kick", {
	schema: {
		headers: GlobalHeadersSchema,
		params: RoomParamsSchema,
		body: RoomBodySchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			403: AppErrorSchema,
			404: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, kickRoomController);

fastify.post("/verify", {
	schema: {
		body: RoomSchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			403: AppErrorSchema,
			404: AppErrorSchema,
			409: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, verifyRoomController);

fastify.post("/launch", {
	schema: {
		body: RoomSchema,
		response: {
			200: RoomSchema,
			400: AppErrorSchema,
			403: AppErrorSchema,
			404: AppErrorSchema,
			409: AppErrorSchema,
			500: AppErrorSchema
		}
	}
}, launchController);

};
