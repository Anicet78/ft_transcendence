import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../../schema/userSchema.js";
import type { LoginResponseType, LoginType } from "../../routes/auth/loginRoute.js";
import { verifyPassword } from "../../services/auth/password.js";
import type { AppUser } from "@prisma/client";
import { UserService } from "../../services/db/userService.js";

export async function banController(
	request: FastifyRequest<{ Body: LoginType }>,
	reply: FastifyReply
) {
	const {email, password} = request.body;

	const dbUser: AppUser | null = await UserService.getUserByMail(email);

	if (!dbUser)
		return reply.code(404).send({ error: "Email not found" });

	if (dbUser.availability === false)
		await UserService.setAvailabality(dbUser.appUserId, true);

	if (!await verifyPassword(dbUser.passwordHash, password))
		return reply.code(401).send({ error: "Incorrect password" });

	const user: User = {
		id: dbUser.appUserId,
		firstname: dbUser.firstName,
		lastname: dbUser.lastName,
		username: dbUser.username,
		email: dbUser.mail,
		region: dbUser.region,
		passwordHash: dbUser.passwordHash
	};

	const token = await reply.jwtSign({ id: user.id, email: user.email });

	const response: LoginResponseType = {token: token, user: user, roomId: "" };

	return reply.status(200).send(response);
}

export async function unbanController(
	request: FastifyRequest<{ Body: LoginType }>,
	reply: FastifyReply
) {
	const {email, password} = request.body;

	const dbUser: AppUser | null = await UserService.getUserByMail(email);

	if (!dbUser)
		return reply.code(404).send({ error: "Email not found" });

	if (dbUser.availability === false)
		await UserService.setAvailabality(dbUser.appUserId, true);

	if (!await verifyPassword(dbUser.passwordHash, password))
		return reply.code(401).send({ error: "Incorrect password" });

	const user: User = {
		id: dbUser.appUserId,
		firstname: dbUser.firstName,
		lastname: dbUser.lastName,
		username: dbUser.username,
		email: dbUser.mail,
		region: dbUser.region,
		passwordHash: dbUser.passwordHash
	};

	const token = await reply.jwtSign({ id: user.id, email: user.email });

	const response: LoginResponseType = {token: token, user: user, roomId: "" };

	return reply.status(200).send(response);
}
