import type { FastifyReply, FastifyRequest } from "fastify";
import type { ResetType } from "../../routes/auth/resetRoute.js";
import "@fastify/cookie";
import { UserService } from "../../services/db/userService.js";
import { verifyResetToken } from "../../plugins/mail.js";
import { hashPassword } from "../../services/auth/password.js";
import * as profileService from '../../services/db/profileService.js';

export async function resetPasswordController(
	request: FastifyRequest<{ Body: ResetType }>,
	reply: FastifyReply
) {
	const { token, newPassword } = request.body;

	const email = verifyResetToken(token);

	const dbUser = await UserService.getUserByMail(email);

	if (!dbUser)
		return reply.code(404).send({ error: "Email not found" });

	const hash: string | null = await hashPassword(newPassword);

	await profileService.updateProfile(dbUser.appUserId, { password: hash });

	return reply.status(204).send();
}
