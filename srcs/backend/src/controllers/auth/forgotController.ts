import type { FastifyReply, FastifyRequest } from "fastify";
import type { ForgotType } from "../../routes/auth/forgotRoute.js";
import "@fastify/cookie";
import { UserService } from "../../services/db/userService.js";
import { sendResetPasswordEmail } from "../../plugins/mail.js";
import crypto from "crypto";

export async function forgotPasswordController(
	request: FastifyRequest<{ Body: ForgotType }>,
	reply: FastifyReply
) {
	const { email } = request.body;

	const dbUser = await UserService.getUserByMail(email);

	if (!dbUser)
		return reply.code(404).send({ error: "Email not found" });

	const token = crypto.randomBytes(32).toString('hex');

	const info = await sendResetPasswordEmail(request.body.email, token, `${process.env.SERVER_URL}/reset-password?token=${token}`);

	console.log(info);

	return reply.status(204).send();
}
