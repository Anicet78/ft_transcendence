import type { FastifyReply, FastifyRequest } from "fastify";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Room } from "../../schema/roomSchema.js";
import type { RoomBodyType, RoomParamsType } from "../../routes/rooms/roomRoute.js";
import { AppError } from "../../schema/errorSchema.js";

export async function getRoomController(
	request: FastifyRequest<{ Params: RoomParamsType }>,
	reply: FastifyReply
) {
	try {
		const response: Room = RoomService.get(request.params.id, request.user.id);
		return reply.status(200).send(response);
	} catch(err) {
		request.log.error(err);
		if (err instanceof AppError)
			return reply.code(err.statusCode).send({ error: err.message });
		return reply.code(500).send({ error: "Internal Server Error" });
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
	try {
		const response: Room = RoomService.join(request.params.id, request.user.id);
		return reply.status(200).send(response);
	} catch (err) {
		request.log.error(err);
		if (err instanceof AppError)
			return reply.code(err.statusCode).send({ error: err.message });
		return reply.code(500).send({ error: "Internal Server Error" });
	}
}

export async function hostRoomController(
	request: FastifyRequest<{ Body: RoomBodyType }>,
	reply: FastifyReply
) {
	if (request.body.userId === request.user.id)
		return reply.code(400).send({ error: "Cannot kick yourself" });

	let room: Room;

	try {
		room = RoomService.get(request.body.roomId, request.user.id);
	} catch(err) {
		request.log.error(err);
		if (err instanceof AppError)
			return reply.code(err.statusCode).send({ error: err.message });
		return reply.code(500).send({ error: "Internal Server Error" });
	}

	if (request.user.id !== room.hostId)
		return reply.code(403).send({ error: "Not leader" });

	if (!room.playersId.includes(request.body.userId))
		return reply.code(404).send({ error: "Target not in room" });

	room.hostId = request.body.userId;
	return reply.status(200).send(room);
}

export async function kickRoomController(
	request: FastifyRequest<{ Body: RoomBodyType }>,
	reply: FastifyReply
) {
	if (request.body.userId === request.user.id)
		return reply.code(400).send({ error: "Cannot kick yourself" });

	let room: Room;

	try {
		room = RoomService.get(request.body.roomId, request.user.id);
	} catch(err) {
		request.log.error(err);
		if (err instanceof AppError)
			return reply.code(err.statusCode).send({ error: err.message });
		return reply.code(500).send({ error: "Internal Server Error" });
	}

	if (request.user.id !== room.hostId)
		return reply.code(403).send({ error: "Not leader" });

	if (!room.playersId.includes(request.body.userId))
		return reply.code(404).send({ error: "Target not in room" });

	RoomService.leave(request.body.userId);
	room = RoomService.create(request.body.userId);
	return reply.status(200).send(room);
}

export async function verifyRoomController(
	request: FastifyRequest<{ Body: Room }>,
	reply: FastifyReply
) {
	let room: Room;

	try {
		room = RoomService.get(request.body.roomId, request.user.id);
	} catch(err) {
		request.log.error(err);
		if (err instanceof AppError)
			return reply.code(err.statusCode).send({ error: err.message });
		return reply.code(500).send({ error: "Internal Server Error" });
	}

	const equals = request.body.hostId === room.hostId && request.body.playersId.length === room.playersId.length &&
		[...request.body.playersId].sort().join(',') === [...room.playersId].sort().join(',');

	if (!equals)
		return reply.code(409).send({ error: "Room data mismatch" });

	return reply.status(200).send(room);
}
