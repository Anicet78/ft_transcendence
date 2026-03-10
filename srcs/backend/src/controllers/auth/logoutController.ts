import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../services/db/prisma.js";
import { RoomService } from "../../services/rooms/roomService.js";
import { UserService } from "../../services/db/userService.js";

export async function postLogoutController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const token = request.cookies.refreshToken;

	if (token) {
		await prisma.refreshToken.updateMany({
			where: {
				tokenHash: token,
				revokedAt: null,
				deletedAt: null
			},
			data: {
				revokedAt: new Date(),
				updatedAt: new Date()
			}
		});
	}

	if (request.user) {
		await UserService.setAvailabality(request.user.id, false);
	}

	try {
		const userSocket = request.getSocket();
		if (userSocket)
			await RoomService.leave(request.user.id, userSocket, "Disconnect");
	} catch {}

	reply.clearAuthCookie();

	return reply.status(200).send({ success: true });
}
