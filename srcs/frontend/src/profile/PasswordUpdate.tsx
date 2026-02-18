import { Box, Button, Input } from "@allxsmith/bestax-bulma"

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';

type ProfileUpdateBodyType = GetBody<"/profile", "patch">;

const PasswordUpdate = () => {
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
		const uname = formData.get("password");
		if (!uname) return ;
		mutation.mutate({
		password: uname.toString()});
	}

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<form action={UpdateAction}>
					<label htmlFor="New password">Enter your new password</label>
					<Input type="password" id="password" name="password" placeholder="Your new password" />
					<label htmlFor="Confirm password">Confirm your new password</label>
					<Input type="password" id="conf_password" name="conf_password" placeholder="confirm your new password" />
					<Button type="submit">Submit</Button>
				</form>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}

export default PasswordUpdate