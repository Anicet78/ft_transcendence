import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { GetBody, GetResponse } from "../types/GetType";
import api from "../serverApi";
import { useAuth } from "./AuthContext";
import toast from "../Notifications";

type GoogleBodyType = GetBody<"/auth/google", "post">;
type GoogleResponseType = GetResponse<"/auth/google", "post">;

function Callback() {
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

		if (!code) {
			toast({ title: "An error occured", message: "No code has been found", type: "is-danger"})
			navigate("/login");
			return ;
		}

		mutation.mutate({ code });
	}, [searchParams]);

	if (mutation.isPending)
		return <div>Logging with google...</div>

	if (mutation.error) {
		toast({ title: "An error occured", message: "Connection failed", type: "is-danger"})
		navigate("/login");
		return ;
	}

	return (
		<div>An error occurred, please refresh.</div>
	)
}

export default Callback
