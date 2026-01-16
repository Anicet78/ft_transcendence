import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../../services/db/userService.js";

export async function postOfflineController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		await UserService.setAvailabality(request.user.id, false);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	return reply.status(200).send({ success: true });
}
