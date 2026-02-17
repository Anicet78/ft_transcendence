import type { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/cookie";
import type { GoogleType } from "../../routes/auth/googleRoute.js";
import { AppError } from "../../schema/errorSchema.js";
import { UserService } from "../../services/db/userService.js";
import { createRefreshToken } from "../../services/auth/token.js";
import type { LoginResponseType } from "../../routes/auth/loginRoute.js";

interface GoogleTokensResult {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
	token_type: string;
	id_token: string;
}

interface GoogleErrorResponse {
	error: string;
	error_description: string;
}

interface GoogleUserInfo {
	sub: string;
	name?: string;
	given_name: string;
	family_name?: string;
	picture?: string;
	email: string;
	email_verified: boolean;
	locale?: string;
}

export async function googleCallbackController(
	request: FastifyRequest<{ Body: GoogleType }>,
	reply: FastifyReply
) {
	if (!process.env.VITE_GOOGLE_CLIENT_ID || !process.env.GOOGLE_SECRET)
		return reply.code(500).send({ error: "Google identifiers are not setup" });

	const { code } = request.body;

	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: process.env.VITE_GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_SECRET,
			redirect_uri: 'http://localhost:5173/callback', // change with https://localhost:8443/callback
			grant_type: 'authorization_code',
		}),
	});

	if (!response.ok) {
		const errorData = await response.json() as GoogleErrorResponse;

		throw new AppError(`Google Auth failed: ${errorData.error_description || errorData.error}`);
	}

	const googleTokens = await response.json() as GoogleTokensResult;

	const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
		headers: { Authorization: `Bearer ${googleTokens.access_token}` }
	});

	const googleUser = (await userRes.json()) as GoogleUserInfo;

	const providerUser = (await UserService.getUserByProviderId("google", googleUser.sub))?.app_user;
	let loginResponse: LoginResponseType;

	if (providerUser) {
		loginResponse = { token: "", user: { id: providerUser.appUserId, email: providerUser.mail, username: providerUser.username, role: providerUser.rolesReceived[0]?.role ?? 'user' } };
	}
	else {
		const userByMail = await UserService.getUserByMail(googleUser.email);

		if (userByMail)
			loginResponse = { token: "", user: { id: userByMail.appUserId, email: userByMail.mail, username: userByMail.username, role: userByMail.rolesReceived[0]?.role ?? 'user' } };
		else {
			let currentUsername = googleUser.given_name;
			let searchUser = await UserService.getUserByUsername(currentUsername);
			let i = 1;
			while (searchUser) {
				currentUsername = googleUser.given_name + i.toString();
				searchUser = await UserService.getUserByUsername(currentUsername);
				i++;
			}

			const createdUser = await UserService.createUserWithProvider({
				id: "",
				email: googleUser.email,
				firstname: googleUser.given_name,
				lastname: googleUser.family_name ?? "",
				passwordHash: "",
				region: "EU",
				role: 'user',
				username: currentUsername
			}, "google", googleUser.sub);

			loginResponse = { token: "", user: { id: createdUser.appUserId, email: createdUser.mail, username: createdUser.username, role: 'user'} };

		}
	}

	const jwt = await reply.jwtSign({ id: loginResponse.user.id, username: loginResponse.user.username, email: loginResponse.user.email, role: loginResponse.user.role });
	const refresh = await createRefreshToken(loginResponse.user.id);

	loginResponse.token = jwt;

	return reply.setCookie('refreshToken', refresh, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
		}).status(200).send(loginResponse);
}
