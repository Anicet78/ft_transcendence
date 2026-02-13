import type { FastifyReply, FastifyRequest } from "fastify";
import type { MeResponseType } from "../../routes/auth/meRoute.js";
import { UserService } from "../../services/db/userService.js";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Room } from "../../schema/roomSchema.js";

export async function getMeController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const user = await UserService.getUserById(request.user.id);
	if (!user)
		return reply.code(401).send({ error: "Invalid identifiers" });

	if (user.availability === false)
		await UserService.setAvailabality(request.user.id, true);

	const room: Room | null = RoomService.find(request.user.id);

	const response: MeResponseType = { user: { id: user.appUserId, username: user.username, email: user.mail, role: user.rolesReceived[0]?.role || "user" }, roomId: room?.roomId || "" };

	return reply.status(200).send(response);
}
