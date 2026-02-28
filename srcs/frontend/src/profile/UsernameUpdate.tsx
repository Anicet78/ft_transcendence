import { Box, Button, Input } from "@allxsmith/bestax-bulma"

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';
import toast from "../Notifications.tsx";

type ProfileUpdateBodyType = GetBody<"/profile", "patch">;

const UsernameUpdate = () => {
	const queryClient = useQueryClient();
	let navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: (data: ProfileUpdateBodyType) => api.patch("/profile", data),
		onSuccess: (data) => {
			queryClient.setQueryData(["profile"], data);
			navigate("/profile")
			toast({title: 'Success', message: 'Username updated successfully!', type: 'is-success'})
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		},
	});

	function UpdateAction(formData: FormData) {
		const uname = formData.get("username");
		if (!uname) return ;
		mutation.mutate({
		username: uname.toString()});
	}

	return (
		<div className="update-container">
			<form action={UpdateAction}>
				<label htmlFor="New username">Enter your new username</label>
				<Input type="text" id="username" name="username" placeholder="Your new username" />
				<Button type="submit">Update username</Button>
			</form>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</div>
	)
}

export default UsernameUpdate
