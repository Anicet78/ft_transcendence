import { type FastifyReply, type FastifyRequest } from "fastify";
import type { User } from "../../schema/userSchema.js";
import type { RegisterResponseType, RegisterType } from "../../routes/auth/registerRoute.js";
import { hashPassword } from "../../services/auth/password.js";
import { UserService } from "../../services/db/userService.js";
import { type AppUser } from "@prisma/client";

export async function postRegisterController(
	request: FastifyRequest<{ Body: RegisterType }>,
	reply: FastifyReply
) {
	const { firstname, lastname, username, region, email, password } = request.body;

	let dbUser: AppUser | null = await UserService.getUserByMail(email);

	if (dbUser)
		return reply.code(409).send({ error: "Email already taken" });

	const hash: string | null = await hashPassword(password);

	const user: User = {
		id: "",
		firstname: firstname,
		lastname: lastname,
		username: username,
		region: region,
		email: email,
		passwordHash: hash,
		role: "user"
	};

	dbUser = await UserService.createUser(user);
	user.id = dbUser.appUserId;
	if (dbUser.availability === false)
		await UserService.setAvailabality(user.id, true);

	const jwt = await reply.jwtSign({ id: user.id, username: user.username, email: user.email, role: user.role });
	const response: RegisterResponseType = {token: jwt, user: user };

	await reply.setAuthCookie(user.id);

	return reply.status(200).send(response);
}
