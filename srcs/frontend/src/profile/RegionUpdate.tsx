import { Box, Button } from "@allxsmith/bestax-bulma"
import SelectRegion from "../components/SelectRegion.tsx";

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';

type ProfileUpdateBodyType = GetBody<"/profile", "patch">;
type RegisterBodyType = GetBody<"/auth/register", "post">

const regionUpdate = () => {
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
		const uname = formData.get("region");
		if (!uname) return ;
		mutation.mutate({
		region: uname.toString() as RegisterBodyType['region']});
	}

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<form action={UpdateAction}>
					<label htmlFor="New region">Enter your new region</label>
					<SelectRegion />
					<Button type="submit">Submit</Button>
				</form>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}

export default regionUpdate