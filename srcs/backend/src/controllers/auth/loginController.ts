import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../../schema/userSchema.js";
import type { LoginResponseType, LoginType } from "../../routes/auth/loginRoute.js";
import { verifyPassword } from "../../services/auth/password.js";
import type { AppUser } from "@prisma/client";
import { UserService } from "../../services/db/userService.js";
import { RoomService } from "../../services/rooms/roomService.js";

export async function postLoginController(
	request: FastifyRequest<{ Body: LoginType }>,
	reply: FastifyReply
) {
	const {email, password} = request.body;

	let dbUser: AppUser | null = null;

	try {
		dbUser = await UserService.getUserByMail(email);
		if (dbUser?.availability === false)
			await UserService.setAvailabality(dbUser.appUserId, true);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	if (!dbUser)
		return reply.code(404).send({ error: "Email doesn't exist in db" });

	try {
		if (!await verifyPassword(dbUser.passwordHash, password))
			return reply.code(401).send({ error: "Incorrect password" });
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Password verification error" });
	}

	const user: User = {
		id: dbUser.appUserId,
		firstname: dbUser.firstName,
		lastname: dbUser.lastName,
		username: dbUser.username,
		email: dbUser.mail,
		region: dbUser.region,//need to check, added to compile
		passwordHash: dbUser.passwordHash
	};

	const token = await reply.jwtSign({ id: user.id, email: user.email });
	const room = RoomService.create(user.id);

	const response: LoginResponseType = {token: token, user: user, roomId: room.roomId };

	return reply.status(200).send(response);
}
