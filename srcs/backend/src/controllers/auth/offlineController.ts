import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../../services/db/userService.js";
import type { OfflineBodyType } from "../../routes/auth/offlineRoute.js";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Socket } from "socket.io";

export async function postOfflineController(
	request: FastifyRequest<{ Body: OfflineBodyType }>,
	reply: FastifyReply
) {
	try {
		await UserService.setAvailabality(request.user.id, false);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	const userSocket: Socket | undefined = request.server.io.sockets.sockets.get(request.body.socketId);
	if (!userSocket)
		return reply.code(404).send({ error: "Socket not found" });

	await RoomService.leave(request.user.id, userSocket, "Disconnect");

	return reply.status(200).send({ success: true });
}
