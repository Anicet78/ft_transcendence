import type { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient, type app_user } from '@prisma/client';
import type { MeResponseType } from "../routes/meRoute.js";

const prisma = new PrismaClient();

export async function getMeController(
	request: FastifyRequest,
	reply: FastifyReply
) {

	const user: app_user | null = await prisma.app_user.findUnique({
		where: { app_user_id: request.user.id }
	});

	if (!user)
		return reply.code(401).send({ error: "Invalid identifiers" });

	const response: MeResponseType = { user: { id: user.app_user_id, email: user.mail_address } };

	return reply.code(200).send(response);
}
