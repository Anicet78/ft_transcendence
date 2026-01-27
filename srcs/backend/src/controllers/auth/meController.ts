import type { FastifyReply, FastifyRequest } from "fastify";
import type { MeResponseType } from "../../routes/auth/meRoute.js";
import { UserService } from "../../services/db/userService.js";
import type { AppUser } from "@prisma/client";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Room } from "../../schema/roomSchema.js";

export async function getMeController(
	request: FastifyRequest,
	reply: FastifyReply
) {

	let user: AppUser | null = null;

	try {
		user = await UserService.getUserById(request.user.id);
		if (user?.availability === false)
			await UserService.setAvailabality(request.user.id, true);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	if (!user)
		return reply.code(401).send({ error: "Invalid identifiers" });

	const room: Room | null = RoomService.find(request.user.id);

	const response: MeResponseType = { user: { id: user.appUserId, email: user.mail }, roomId: room?.roomId || "" };

	return reply.status(200).send(response);
}
