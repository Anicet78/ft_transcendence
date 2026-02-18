import { Box, Button, Input } from "@allxsmith/bestax-bulma"

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';

type ProfileUpdateBodyType = GetBody<"/profile", "patch">;

const AvatarUpdate = () => {
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
		const avatar = formData.get("avatar");
		if (!avatar) return ;
		mutation.mutate({
		avatarUrl: avatar.toString()});
	}

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<form action={UpdateAction}>
					<label htmlFor="New avatar">Enter your new avatar's url</label>
					<Input type="text" id="avatar" name="avatar" placeholder="Your new avatar's url" />
					<Button type="submit">Submit</Button>
				</form>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}

export default AvatarUpdate