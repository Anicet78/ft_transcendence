import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../../services/db/userService.js";
import type { OfflineBodyType } from "../../routes/auth/offlineRoute.js";
import { RoomService } from "../../services/rooms/roomService.js";

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

	RoomService.leave(request.user.id);

	return reply.status(200).send({ success: true });
}
