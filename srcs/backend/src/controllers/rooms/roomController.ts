import type { FastifyReply, FastifyRequest } from "fastify";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Room } from "../../schema/roomSchema.js";
import type { RoomBodyType, RoomParamsType } from "../../routes/rooms/roomRoute.js";
import type { Socket } from "socket.io";
import { SocketService } from "../../services/socket/SocketService.js";
import type { GlobalHeaders } from "../../schema/globalHeadersSchema.js";

export async function getRoomController(
	request: FastifyRequest<{ Params: RoomParamsType }>,
	reply: FastifyReply
) {
	const response: Room = RoomService.get(request.params.id, request.user.id);
	return reply.status(200).send(response);
}

export async function newRoomController(
	request: FastifyRequest<{ Headers: GlobalHeaders, Body: RoomBodyType }>,
	reply: FastifyReply
) {
	const userSocket: Socket | undefined = request.server.io.sockets.sockets.get(request.headers["x-socket-id"]);
	if (!userSocket)
		return reply.code(404).send({ error: "Socket not found" });

	await RoomService.leave(request.user.id, userSocket);

	const response: Room = await RoomService.create(request.user.id, userSocket);

	return reply.status(200).send(response);
}

export async function joinRoomController(
	request: FastifyRequest<{ Headers: GlobalHeaders, Params: RoomParamsType, Body: RoomBodyType }>,
	reply: FastifyReply
) {
	const userSocket: Socket | undefined = request.server.io.sockets.sockets.get(request.headers["x-socket-id"]);
	if (!userSocket)
		return reply.code(404).send({ error: "Socket not found" });

	const response: Room = await RoomService.join(request.params.id, request.user.id, userSocket);
	return reply.status(200).send(response);
}

export async function hostRoomController(
	request: FastifyRequest<{ Params: RoomParamsType, Body: RoomBodyType }>,
	reply: FastifyReply
) {
	if (request.body.userId === request.user.id)
		return reply.code(400).send({ error: "Already host" });

	const room: Room = RoomService.get(request.params.id, request.user.id);

	if (request.user.id !== room.hostId)
		return reply.code(403).send({ error: "Not leader" });

	if (!room.playersId.includes(request.body.userId))
		return reply.code(404).send({ error: "Target not in room" });

	SocketService.send(room.roomId, "host_changed", {
		oldHost: room.hostId,
		newHost: request.body.userId
	});

	room.hostId = request.body.userId;
	return reply.status(200).send(room);
}

export async function kickRoomController(
	request: FastifyRequest<{ Headers: GlobalHeaders, Params: RoomParamsType, Body: RoomBodyType }>,
	reply: FastifyReply
) {
	if (request.body.userId === request.user.id)
		return reply.code(400).send({ error: "Cannot kick yourself" });

	const room: Room = RoomService.get(request.params.id, request.user.id);

	if (request.user.id !== room.hostId)
		return reply.code(403).send({ error: "Not leader" });

	if (!room.playersId.includes(request.body.userId))
		return reply.code(404).send({ error: "Target not in room" });

	const userSocket: Socket | undefined = request.server.io.sockets.sockets.get(request.headers["x-socket-id"]);
	if (!userSocket)
		return reply.code(404).send({ error: "Socket not found" });

	await RoomService.leave(request.body.userId, userSocket, "Kicked");

	SocketService.send(request.body.userId, "kicked", {
		hostId: request.user.id,
		Room: await RoomService.create(request.body.userId, userSocket)
	});
	return reply.status(200).send(room);
}

export async function verifyRoomController(
	request: FastifyRequest<{ Body: Room }>,
	reply: FastifyReply
) {
	const room: Room = RoomService.get(request.body.roomId, request.user.id);

	const equals = request.body.hostId === room.hostId && request.body.playersId.length === room.playersId.length &&
		[...request.body.playersId].sort().join(',') === [...room.playersId].sort().join(',');

	if (!equals)
		return reply.code(409).send({ error: "Room data mismatch" });

	return reply.status(200).send(room);
}
