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
		return reply.code(409).send({ error: "Already exist" });

	const hash: string | null = await hashPassword(password);

	const user: User = {
		id: "",
		firstname: firstname,
		lastname: lastname,
		username: username,
		region: region,
		email: email,
		passwordHash: hash,
		role: "User"
	};

	dbUser = await UserService.createUser(user);
	user.id = dbUser.appUserId;
	if (dbUser.availability === false)
		await UserService.setAvailabality(user.id, true);

	const token = await reply.jwtSign({ id: user.id, email: user.email, role: user.role });

	const response: RegisterResponseType = {token: token, user: user, roomId: "" };

	return reply.status(200).send(response);
}
