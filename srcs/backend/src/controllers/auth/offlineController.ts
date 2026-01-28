import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../../services/db/userService.js";
import type { OfflineBodyType } from "../../routes/auth/offlineRoute.js";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Socket } from "socket.io";

export async function postOfflineController(
	request: FastifyRequest<{ Body: OfflineBodyType }>,
	reply: FastifyReply
) {
	await UserService.setAvailabality(request.user.id, false);

	const userSocket: Socket | undefined = request.server.io.sockets.sockets.get(request.body.socketId);
	if (userSocket)
		await RoomService.leave(request.user.id, userSocket, "Disconnect");

	return reply.status(200).send({ success: true });
}
