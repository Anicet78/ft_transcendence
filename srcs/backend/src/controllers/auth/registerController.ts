import { type FastifyReply, type FastifyRequest } from "fastify";
import type { User } from "../../schema/userSchema.js";
import type { RegisterResponseType, RegisterType } from "../../routes/auth/registerRoute.js";
import { hashPassword } from "../../services/auth/password.js";
import { UserService } from "../../services/db/userService.js";
import type { AppUser } from "@prisma/client";

export async function postRegisterController(
	request: FastifyRequest<{ Body: RegisterType }>,
	reply: FastifyReply
) {
	const { firstname, lastname, username, email, password } = request.body;

	let dbUser: AppUser | null = null;

	try {
		dbUser = await UserService.getUserByMail(email);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	if (dbUser)
		return reply.code(409).send({ error: "Already exist" });

	let hash: string | null = null;

	try {
		hash = await hashPassword(password);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Password hashing error" });
	}

	const user: User = {
		id: "",
		firstname: firstname,
		lastname: lastname,
		username: username,
		email: email,
		passwordHash: hash
	};

	try {
		const dbUser: AppUser = await UserService.createUser(user);
		user.id = dbUser.appUserId;
	}
	catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Database issue" });
	}

	const response: RegisterResponseType = {token: await reply.jwtSign({ id: user.id, email: user.email }), user: user };

	return reply.status(200).send(response);
}
