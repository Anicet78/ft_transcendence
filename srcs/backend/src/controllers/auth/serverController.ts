import type { FastifyReply, FastifyRequest } from "fastify";
import type { ServerType } from "../../routes/auth/serverRoute.js";

export async function serverController(
	request: FastifyRequest<{ Body: ServerType }>,
	reply: FastifyReply
) {
	const { clientId, clientSecret } = request.body;

	if (clientId !== process.env.GAME_CLIENT_ID || clientSecret !== process.env.GAME_CLIENT_SECRET)
		return reply.code(401).send({ error: 'Server identifiers do not match' });

	const token = await reply.jwtSign({
		id: clientId,
		role: 'game-server'
	}, { expiresIn: '1h' });

	return { token };

};
