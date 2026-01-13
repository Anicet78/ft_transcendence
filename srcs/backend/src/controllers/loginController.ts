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

	const user: User = {id: "1", email: email, username: "test", passwordHash: await hashPassword("password")}; // Get the id by searching the email in the db

	console.log(password);

	try {
		if (!await verifyPassword(user.passwordHash, password))
			reply.code(401).send("invalid password")
	} catch (err) {
		request.log.error(err);
		reply.code(500).send("Password verification error");
	}

	const response: LoginResponseType = {token: createAccessToken({userId: user.id, email: user.email}), user: user};

	reply.status(200).send(response);
}
