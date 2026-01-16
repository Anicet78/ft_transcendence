import type { FastifyReply, FastifyRequest } from "fastify";
import type { MeResponseType } from "../../routes/auth/meRoute.js";
import { UserService } from "../../services/db/userService.js";
import type { AppUser } from "@prisma/client";

export async function getMeController(
	request: FastifyRequest,
	reply: FastifyReply
) {

	let user: AppUser | null = null;

	try {
		user = await UserService.getUserById(request.user.id);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	if (!user)
		return reply.code(401).send({ error: "Invalid identifiers" });

	const response: MeResponseType = { user: { id: user.appUserId, email: user.mail } };

	return reply.status(200).send(response);
}
