import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { GetBody, GetResponse } from "../types/GetType";
import api from "../serverApi";
import { useAuth } from "./AuthContext";
import toast from "../Notifications";
import { REDIRECT_URI } from "./callbackGoogle";

type FortyTwoBodyType = GetBody<"/auth/42", "post">;
type FortyTwoResponseType = GetResponse<"/auth/42", "post">;

export const handle42Login = () => {
	const FORTYTWO_CLIENT_ID = window._env_?.VITE_42_CLIENT_ID || import.meta.env.VITE_42_CLIENT_ID;

	if (!FORTYTWO_CLIENT_ID) {
		toast({ title: "Redirection error", message: "42 identifiers are not setup", type: "is-danger" });
		return ;
	}

	const state = btoa(JSON.stringify({
		returnUrl: window.location.origin,
		nonce: Math.random().toString(36).substring(7)
	}));

	const fortyTwoUrl = `https://api.intra.42.fr/oauth/authorize?` +
		`client_id=${FORTYTWO_CLIENT_ID}&` +
		`redirect_uri=${encodeURIComponent(REDIRECT_URI)}42&` +
		`state=${state}&` +
		// `scope=${encodeURIComponent(SCOPE)}&` +
		`response_type=code`

	window.location.href = fortyTwoUrl;
}

function Callback42() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { login } = useAuth();

	const mutation = useMutation({
		mutationFn: (data: FortyTwoBodyType ) => api.post("/auth/42", data),
		onSuccess: (data) => {
			const response: FortyTwoResponseType = data.data;
			login(response.user, response.token);
		},
	});

	useEffect(() => {
		const code = searchParams.get('code');
		const stateParam = searchParams.get('state');

		if (stateParam) {
			const state = JSON.parse(atob(stateParam));

			if (state.returnUrl !== window.location.origin) {
				window.location.href = `${state.returnUrl}/callback42?code=${code}`;
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

	if (mutation.isPending) {
		return <div>Logging with 42...</div>
	}

	if (mutation.isError) {
		toast({ title: "An error occured", message: mutation.error.message, type: "is-danger"})
		navigate("/login");
		return ;
	}

	return (
		<div>An error occurred, please refresh.</div>
	)
}

export default Callback42
