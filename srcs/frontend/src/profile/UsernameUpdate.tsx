import { Box, Button, Input } from "@allxsmith/bestax-bulma"

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';

type ProfileUpdateBodyType = GetBody<"/profile", "patch">;

const UsernameUpdate = () => {
	const queryClient = useQueryClient();
	let navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: (data: ProfileUpdateBodyType) => api.patch("/profile", data),
		onSuccess: (data) => {
		queryClient.setQueryData(["profile"], data);
		navigate("/profile")
		},
	});

	function UpdateAction(formData: FormData) {
		const uname = formData.get("username");
		if (!uname) return ;
		mutation.mutate({
		username: uname.toString()});
	}

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<form action={UpdateAction}>
					<label htmlFor="New username">Enter your new username</label>
					<Input type="text" id="username" name="username" placeholder="Your new username" />
					<Button type="submit">Submit</Button>
				</form>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}

export default UsernameUpdate