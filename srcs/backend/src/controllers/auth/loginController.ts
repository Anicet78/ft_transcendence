import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginResponseType, LoginType } from "../../routes/auth/loginRoute.js";
import "@fastify/cookie";
import { verifyPassword } from "../../services/auth/password.js";
import { UserService } from "../../services/db/userService.js";
import { createRefreshToken } from "../../services/auth/token.js";

export async function postLoginController(
	request: FastifyRequest<{ Body: LoginType }>,
	reply: FastifyReply
) {
	const {email, password} = request.body;

	const dbUser = await UserService.getUserByMail(email);

	if (!dbUser)
		return reply.code(404).send({ error: "Email not found" });

	if (dbUser.availability === false)
		await UserService.setAvailabality(dbUser.appUserId, true);

	if (!dbUser.passwordHash || !await verifyPassword(dbUser.passwordHash, password))
		return reply.code(400).send({ error: "Incorrect password" });

	const user = {
		id: dbUser.appUserId,
		firstname: dbUser.firstName,
		lastname: dbUser.lastName,
		username: dbUser.username,
		email: dbUser.mail,
		region: dbUser.region,
		passwordHash: dbUser.passwordHash,
		role: dbUser.rolesReceived[0]?.role || "user"
	};

	const jwt = await reply.jwtSign({ id: user.id, username: user.username, email: user.email, role: user.role });
	const refresh = await createRefreshToken(user.id);

	const response: LoginResponseType = { token: jwt, user: user };

	return reply.setCookie('refreshToken', refresh, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
		}).status(200).send(response);
}
