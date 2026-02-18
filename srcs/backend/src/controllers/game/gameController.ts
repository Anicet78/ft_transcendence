import type { FastifyReply, FastifyRequest } from "fastify";
import { sessionPlayerResult, type sessionBody, type sessionEndBody } from "../../schema/gameSchema.js";
import { createSessionService, sessionEndService, sessionPlayerResultService } from "../../services/db/gameService.js";

//controller for session creation
export async function sessionCreationController(
	request: FastifyRequest<{ Body: sessionBody }>,
	reply: FastifyReply) {
		const { sessionGameId, startedAt, status, playerIds } = request.body;

		//potentially check for sessionId duplicate

		const session: sessionBody = {
			sessionGameId: sessionGameId,
			startedAt: startedAt,
			status: status,
			playerIds: playerIds
		};

		await createSessionService(session);
		return reply.status(201).send({ success: true });
}

//controller for session end
export async function sessionEndController(
	request: FastifyRequest<{ Body: sessionEndBody }>,
	reply: FastifyReply) {
		const { sessionGameId, status } = request.body;

		//FAUT AJOUTER LES RESULTATS DE LA GAME AUSSI
		const session: sessionEndBody = {
			sessionGameId: sessionGameId,
			status: status
		};

		await sessionEndService(session);

		return reply.status(200).send({ success: true });
}

export async function sessionPlayerResultController(
	request: FastifyRequest<{ Body: sessionPlayerResult }>,
	reply: FastifyReply) {
		const { sessionGameId, playerId, completionTime, ennemiesKilled, isWinner, gainedXp } = request.body;

		const playerResult: sessionPlayerResult = {
			sessionGameId: sessionGameId,
			playerId: playerId,
			completionTime: completionTime,
			ennemiesKilled: ennemiesKilled,
			isWinner: isWinner,
			gainedXp: gainedXp
		}
		await sessionPlayerResultService(playerResult);

		return (reply.status(200).send({success: true}));
	}