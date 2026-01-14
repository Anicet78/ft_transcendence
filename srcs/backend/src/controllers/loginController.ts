import type { FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../models/userModel.js";
import type { LoginResponseType, LoginType } from "../routes/loginRoute.js";
import { hashPassword, verifyPassword } from "../services/auth/password.js";
import { createAccessToken } from "../services/auth/token.js";

export async function postLoginController(
	request: FastifyRequest<{ Body: LoginType }>,
	reply: FastifyReply
) {
	const {email, password} = request.body;

	// Get the id by searching the email in the db, this is just for testing purpose
	const user: User = {
		id: "1",
		firstname: "Anicet",
		lastname: "Maxime Nina",
		username: "Tom Julie",
		email: email,
		passwordHash: await hashPassword("password")
	};

	try {
		if (!await verifyPassword(user.passwordHash, password))
			return reply.code(401).send("invalid password");
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send("password verification error");
	}

	const response: LoginResponseType = {token: createAccessToken({userId: user.id, email: user.email}), user: user};

	return reply.status(200).send(response);
}
