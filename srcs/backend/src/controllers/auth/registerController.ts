import { type FastifyReply, type FastifyRequest } from "fastify";
import type { User } from "../../schema/userSchema.js";
import type { RegisterResponseType, RegisterType } from "../../routes/auth/registerRoute.js";
import { hashPassword } from "../../services/auth/password.js";
import { UserService } from "../../services/db/userService.js";
import { Prisma, type AppUser } from "@prisma/client";
import { RoomService } from "../../services/rooms/roomService.js";
import type { Socket } from "socket.io";

export async function postRegisterController(
	request: FastifyRequest<{ Body: RegisterType }>,
	reply: FastifyReply
) {
	const { firstname, lastname, username, region, email, password } = request.body;

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
		region: region,
		email: email,
		passwordHash: hash
	};

	try {
		const dbUser: AppUser = await UserService.createUser(user);
		user.id = dbUser.appUserId;
		if (dbUser.availability === false)
			await UserService.setAvailabality(user.id, true);
	} catch (err) {
		request.log.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2002') {
				return reply.code(409).send({ error: "Already taken", field: err.meta?.target });
			}
		}
		return reply.code(500).send({ error: "Database issue" });
	}

	const userSocket: Socket | undefined = request.server.io.sockets.sockets.get(request.body.socketId);
	if (!userSocket)
		return reply.code(404).send({ error: "Socket not found" });

	const token = await reply.jwtSign({ id: user.id, email: user.email });
	const room = await RoomService.create(user.id, userSocket);

	const response: RegisterResponseType = {token: token, user: user, roomId: room.roomId };

	return reply.status(200).send(response);
}
