import type { GameResult, GameSession } from '@prisma/client';
import { prisma } from './prisma.js';
import type { sessionBody, sessionEndBody, sessionPlayerResult } from '../../schema/gameSchema.js';
import { AppError } from '../../schema/errorSchema.js';

export async function createSessionService(session: sessionBody): Promise<GameSession> {

	const uniquePlayer = Array.from(new Set(session.playerIds))

	return prisma.gameSession.create({
		data: {
			sessionGameId: session.sessionGameId,
			startedAt: new Date(),
			status: session.status,
			results: {
				create: uniquePlayer.map((playerId) => ({
				player: {
					connect: { appUserId: playerId }
					}
				}))
			}
		}
	});
}

export async function sessionEndService(session: sessionEndBody): Promise<GameSession> {

	const sessionGameId = session.sessionGameId;

	const lobby = await prisma.gameSession.findUnique({
		where: { sessionGameId },
		select: {
			status: true,
			startedAt: true,
			endedAt: false
		}
	});

	if (!lobby) {
		throw new AppError('Game Session not found', 404);
	}

	const ended = await prisma.gameSession.update({
		where: { sessionGameId },
		data: {
			endedAt: new Date(),
			updatedAt: new Date(),
			status: session.status
		}
	});

	return ended;
}

export async function sessionPlayerResultService(playerResult: sessionPlayerResult) : Promise<GameResult> {

	const sessionGameId = playerResult.sessionGameId;

	const session = await prisma.gameSession.findUnique({
		where: { sessionGameId },
		select: {
			sessionId: true,
			status: true,
			startedAt: true
		}
	});

	if (!session) {
		throw new AppError('Game Session not found during sessionPlayerResultService', 404);
	}

	const gameId = session.sessionId;

	const playerId = playerResult.playerId;

	const sessionResult = await prisma.gameResult.findFirst({
		where: { gameId, playerId },
		select: {
			gameResultId: true,
			completionTime: true,
			enemiesKilled: true,
			gainedXp: true,
			updatedAt: true,
			isWinner: true
		}
	});

	if (!sessionResult) {
		throw new AppError('Player Result not found during sessionPlayerResultService', 404);
	}
	if (sessionResult.completionTime !== null) {
		throw new AppError('Player Result already filled', 409);
	}

	const gameResultId = sessionResult.gameResultId;

	const updateResult = await prisma.gameResult.update({
		where: { gameResultId },
		data: {
			completionTime: playerResult.completionTime,
			enemiesKilled: playerResult.ennemiesKilled,
			gainedXp: playerResult.gainedXp,
			updatedAt: new Date(),
			isWinner: playerResult.isWinner
		}
	});

	const gameProfile = await prisma.gameProfile.findUnique({
		where: { userId: playerId },
		select: {
			totalGames: true,
			totalWins: true,
			totalLoses: true,
			totalEnemiesKilled: true,
			totalXp: true,
			bestTime: true,
			level: true
		}
	});

	if (!gameProfile) {
		throw new AppError('Game Profile not found', 404);
	}

	const totalGames = gameProfile.totalGames + 1;

	let totalWins = gameProfile.totalWins;
	let totalLoses = gameProfile.totalLoses;
	let level = gameProfile.level;

	if (playerResult.isWinner === true) {
		totalWins++;
	}
	else {
		totalLoses++;
	}

	const totalEnemiesKilled = gameProfile.totalEnemiesKilled + playerResult.ennemiesKilled;
	const totalXp = gameProfile.totalXp + playerResult.gainedXp;

	level = totalXp / 20;

	let bestTime = gameProfile.bestTime;

	if (bestTime > playerResult.completionTime || bestTime === 0) {
		bestTime = playerResult.completionTime;
	}

	await prisma.gameProfile.update({
		where: { userId: playerId },
		data: {
			totalGames: totalGames,
			totalWins: totalWins,
			totalLoses: totalLoses,
			totalEnemiesKilled: totalEnemiesKilled,
			totalXp: totalXp,
			bestTime: bestTime,
			level: level
		}
	});

	return updateResult;
}