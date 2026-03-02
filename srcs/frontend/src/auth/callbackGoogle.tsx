import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { GetBody, GetResponse } from "../types/GetType";
import api from "../serverApi";
import { useAuth } from "./AuthContext";
import toast from "../Notifications";

type GoogleBodyType = GetBody<"/auth/google", "post">;
type GoogleResponseType = GetResponse<"/auth/google", "post">;

export const REDIRECT_URI = "https://localhost:8443/callback";

export const handleGoogleLogin = () => {
	const GOOGLE_CLIENT_ID = window._env_?.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID;

	if (!GOOGLE_CLIENT_ID) {
		toast({ title: "Redirection error", message: "Google identifiers are not setup", type: "is-danger" });
		return ;
	}

	const SCOPE = "openid email profile";
	const state = btoa(JSON.stringify({
		returnUrl: window.location.origin,
		nonce: Math.random().toString(36).substring(7) // Sécurité
	}));

	const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
		`client_id=${GOOGLE_CLIENT_ID}&` +
		`redirect_uri=${encodeURIComponent(REDIRECT_URI)}Google&` +
		`response_type=code&` +
		`scope=${encodeURIComponent(SCOPE)}&` +
		`state=${state}&` +
		`access_type=offline&` +
		`prompt=consent`;

	window.location.href = googleUrl;
}

function CallbackGoogle() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { login } = useAuth();

	const mutation = useMutation({
		mutationFn: (data: GoogleBodyType ) => api.post("/auth/google", data),
		onSuccess: (data) => {
			const response: GoogleResponseType = data.data;
			login(response.user, response.token);
		},
	});

	useEffect(() => {
		const code = searchParams.get('code');
		const stateParam = searchParams.get('state');

		if (stateParam) {
			const state = JSON.parse(atob(stateParam));

			if (state.returnUrl !== window.location.origin) {
				window.location.href = `${state.returnUrl}/callbackGoogle?code=${code}`;
				return;
			}
		}

		if (!code) {
			toast({ title: "An error occured", message: "No code has been found", type: "is-danger"})
			navigate("/login");
			return ;
		}

		mutation.mutate({ code });
	}, [searchParams]);

	if (mutation.isPending)
		return <div>Logging with google...</div>

	if (mutation.isError) {
		toast({ title: "An error occured", message: mutation.error.message, type: "is-danger"})
		navigate("/login");
		return ;
	}

	return (
		<div>An error occurred, please refresh.</div>
	)
}

export default CallbackGoogle
