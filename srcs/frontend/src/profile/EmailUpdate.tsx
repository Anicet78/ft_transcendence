import { Box, Button, Input } from "@allxsmith/bestax-bulma"

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';
import toast from "../Notifications.tsx";
import type React from "react";

type ProfileUpdateBodyType = GetBody<"/profile", "patch">;

const EmailUpdate = () => {
	const queryClient = useQueryClient();
	let navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: (data: ProfileUpdateBodyType) => api.patch("/profile", data),
		onSuccess: (data) => {
			queryClient.setQueryData(["profile"], data);
			navigate("/profile")
			toast({title: 'Success', message: 'Email updated successfully!', type: 'is-success'})
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
	}});

	function UpdateAction(formData: FormData) {
		const mail = formData.get("mail");
		if (!mail) return ;
		mutation.mutate({
		mail: mail.toString()});
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
            const formData = new FormData(e.currentTarget);
            UpdateAction(formData);
	}

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<form onSubmit={handleSubmit}>
					<label htmlFor="mail">Enter your new email</label>
					<Input type="email" id="mail" name="mail" placeholder="Your new email" />
					<Button type="submit">Submit</Button>
				</form>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}

export default EmailUpdate