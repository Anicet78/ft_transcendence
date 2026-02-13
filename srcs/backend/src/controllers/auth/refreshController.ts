import { type FastifyReply, type FastifyRequest } from "fastify";
import { createRefreshToken } from "../../services/auth/token.js";
import { prisma } from "../../services/db/prisma.js";
import { UserService } from "../../services/db/userService.js";

export async function postRefreshController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const token = request.cookies.refreshToken;

	if (!token)
		return reply.code(400).send({ error: "Missing refresh token" });

	const dbUser = await prisma.refreshToken.findMany({
		where: { tokenHash: token },
		include: { app_user: {
			include: {
				rolesReceived: {
					where: {
						deletedAt: null,
					},
					orderBy: {
						createdAt: 'desc',
					},
					take: 1
				},
			}
		} },
	});

	if (!dbUser || !dbUser[0] || dbUser[1])
		return reply.code(404).send({ error: "Unknown Token" });

	const user = dbUser[0];

	if (user.expiresAt < new Date())
		return reply.code(401).send({ error: "Token Expired" });

	if (user.revokedAt || user.deletedAt)
		return reply.code(401).send({ error: "Token Revoked" });

	if (!user.app_user)
		return reply.code(404).send({ error: "Unknown User" });

	if (user.app_user.availability === false)
		await UserService.setAvailabality(user.app_user.appUserId, true);

	const jwt = await reply.jwtSign({ id: user.app_user.appUserId, username: user.app_user.username, email: user.app_user.mail, role: user.app_user.rolesReceived[0]?.role || "user" });
	const refresh = await createRefreshToken(user.app_user.appUserId);

	await prisma.refreshToken.update({
		where: {
			tokenId: user.tokenId
		},
		data: {
			revokedAt: new Date(),
			updatedAt: new Date()
		}
	});

	return reply.setCookie('refreshToken', refresh, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
		}).status(200).send({ token: jwt, user: { id: user.app_user.appUserId, username: user.app_user.username, email: user.app_user.mail, role: user.app_user.rolesReceived[0]?.role || "user" }});
}
