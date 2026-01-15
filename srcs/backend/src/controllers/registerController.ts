import { type FastifyReply, type FastifyRequest } from "fastify";
import type { User } from "../models/userModel.js";
import type { RegisterResponseType, RegisterType } from "../routes/registerRoute.js";
import { hashPassword } from "../services/auth/password.js";

export async function postRegisterController(
	request: FastifyRequest<{ Body: RegisterType }>,
	reply: FastifyReply
) {
	const { firstname, lastname, username, email, password } = request.body;

	//	if (user already exists in db):
	//		return reply.code(409).send("already exist");

	let hash: string | null = null;

	try {
		hash = await hashPassword(password);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send("password hashing error");
	}

	const user: User = {
		id: "",
		firstname: firstname,
		lastname: lastname,
		username: username,
		email: email,
		passwordHash: hash
	};

	//	try {
	//		create user on db (user); -> write the correct id inside the User
	//	}
	//	catch (err) {
	//		return reply.code(500).send("database issue");
	//	}

	const response: RegisterResponseType = {token: await reply.jwtSign({ id: user.id, email: user.email}), user: user };

	return reply.status(200).send(response);
}
