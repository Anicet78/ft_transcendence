import crypto from "crypto";
import { prisma } from "../db/prisma.js";

export async function createRefreshToken(userId: string): Promise <string> {
	const refreshToken: string = crypto.randomBytes(40).toString('hex');

	const date = new Date();
	date.setDate(date.getDate() + 7);

	await prisma.refreshToken.create({
		data: {
			userId: userId,
			tokenHash: refreshToken,
			expiresAt: date,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	});

	return refreshToken;
}