import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { GetBody, GetResponse } from "../types/GetType";
import api from "../serverApi";
import { useAuth } from "./AuthContext";
import toast from "../Notifications";

type FortyTwoBodyType = GetBody<"/auth/42", "post">;
type FortyTwoResponseType = GetResponse<"/auth/42", "post">;

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
