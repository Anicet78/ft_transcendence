import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../services/db/prisma.js";

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

	reply.clearCookie('refreshToken', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict'
	});

	return reply.status(200).send({ success: true });
}
