import type { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/cookie";
import type { FortyTwoType } from "../../routes/auth/fortyTwoRoute.js";
import { AppError } from "../../schema/errorSchema.js";
import { UserService } from "../../services/db/userService.js";
import { createRefreshToken } from "../../services/auth/token.js";
import type { LoginResponseType } from "../../routes/auth/loginRoute.js";

interface FortyTwoTokensResult {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
	token_type: string;
	id_token: string;
}

interface FortyTwoErrorResponse {
	error: string;
	error_description: string;
}

interface FortyTwoUserInfo {
	id: string;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	image: { link: string };
}

export async function fortyTwoCallbackController(
	request: FastifyRequest<{ Body: FortyTwoType }>,
	reply: FastifyReply
) {
	if (!process.env.VITE_42_CLIENT_ID || !process.env.SECRET_42)
		return reply.code(500).send({ error: "42 identifiers are not setup" });

	const { code } = request.body;

	const response = await fetch('https://api.intra.42.fr/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: process.env.VITE_42_CLIENT_ID,
			client_secret: process.env.SECRET_42,
			redirect_uri: 'http://localhost:5173/callback42', // change with https://localhost:8443/callback42
			grant_type: 'authorization_code',
		}),
	});

	if (!response.ok) {
		const errorData = await response.json() as FortyTwoErrorResponse;

		throw new AppError(`42 Auth failed: ${errorData.error_description || errorData.error}`);
	}

	const fortyTwoTokens = await response.json() as FortyTwoTokensResult;

	const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
		headers: {
			'Authorization': `Bearer ${fortyTwoTokens.access_token}`
		}
	});

	if (!userResponse.ok) {
		throw new Error("Cannot fetch the 42 user's infos");
	}

	const fortyTwoUser = (await userResponse.json()) as FortyTwoUserInfo;

	const providerUser = (await UserService.getUserByProviderId("fortyTwo", fortyTwoUser.id))?.app_user;
	let loginResponse: LoginResponseType;

	if (providerUser) {
		loginResponse = { token: "", user: { id: providerUser.appUserId, email: providerUser.mail, username: providerUser.username, role: providerUser.rolesReceived[0]?.role ?? 'user' } };
	}
	else {
		const userByMail = await UserService.getUserByMail(fortyTwoUser.email);

		if (userByMail)
			loginResponse = { token: "", user: { id: userByMail.appUserId, email: userByMail.mail, username: userByMail.username, role: userByMail.rolesReceived[0]?.role ?? 'user' } };
		else {
			let currentUsername = fortyTwoUser.login;
			let searchUser = await UserService.getUserByUsername(currentUsername);
			let i = 1;
			while (searchUser) {
				currentUsername = fortyTwoUser.login + i.toString();
				searchUser = await UserService.getUserByUsername(currentUsername);
				i++;
			}

			const createdUser = await UserService.createUserWithProvider({
				id: "",
				email: fortyTwoUser.email,
				firstname: fortyTwoUser.first_name,
				lastname: fortyTwoUser.last_name,
				passwordHash: "",
				region: "EU",
				role: 'user',
				username: currentUsername
			}, "fortyTwo", fortyTwoUser.id);

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
