import type { FastifyReply, FastifyRequest } from "fastify";
import { RoomService } from "../services/rooms/roomService.js";
import type { Room } from "../schema/roomSchema.js";
import type { RoomBodyType, RoomParamsType } from "../routes/roomRoute.js";

export async function getRoomController(
	request: FastifyRequest<{ Params: RoomParamsType }>,
	reply: FastifyReply
) {
	try {
		const response: Room = RoomService.get(request.params.id, request.user.id);
		return reply.status(200).send(response);
	} catch(err) {
		request.log.error(err);
		if (err === "Room not found")
			return reply.code(404).send({ error: err });
		else if (err === "Not in room")
			return reply.code(403).send({ error: err });
		return reply.code(500).send({ error: "An error has occured" });
	}
}

export async function newRoomController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	RoomService.leave(request.user.id);

	const response: Room = RoomService.create(request.user.id);

	return reply.status(200).send(response);
}

export async function joinRoomController(
	request: FastifyRequest<{ Params: RoomParamsType }>,
	reply: FastifyReply
) {
	RoomService.leave(request.user.id);

	try {
		const response: Room = RoomService.join(request.params.id, request.user.id);
		return reply.status(200).send(response);
	} catch (err) {
		request.log.error(err);
		if (err === "Room not found")
			return reply.code(404).send({ error: err });
		else if (err === "Room full")
			return reply.code(409).send({ error: err });
		return reply.code(500).send({ error: "An error has occured" });
	}
}

export async function hostRoomController(
	request: FastifyRequest<{ Body: RoomBodyType }>,
	reply: FastifyReply
) {
	let room: Room;

	try {
		room = RoomService.get(request.body.roomId, request.user.id);
	} catch(err) {
		request.log.error(err);
		if (err === "Room not found")
			return reply.code(404).send({ error: err });
		else if (err === "Not in room")
			return reply.code(403).send({ error: err });
		return reply.code(500).send({ error: "An error has occured" });
	}

	if (request.user.id !== room.hostId)
		return reply.code(403).send({ error: "Not leader" });

	if (!room.playersId.includes(request.body.userId))
		return reply.code(404).send({ error: "Target not in room" });

	room.hostId = request.body.userId;
	return reply.status(200).send(room);
}