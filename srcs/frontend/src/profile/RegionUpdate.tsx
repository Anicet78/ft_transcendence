import { Box, Button } from "@allxsmith/bestax-bulma"

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

	function Update(formData: FormData) {
		const uname = formData.get("region");
		if (!uname) return ;
		mutation.mutate({
		region: uname.toString() as RegisterBodyType['region']});
	}

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<form action={Update}>
					<div className="field">
						<label htmlFor="region">Select your region</label>
						<div className="control has-icons-left">
							<div className="select">
								<div className="icon is-small is-left">
									<i className="fas fa-globe"></i>
								</div>
								<select 
									aria-label="region selection" 
									id='region' 
									name='region' 
									required
								>
									<option defaultValue='EU'>EU</option>
									<option value='NA'>NA</option>
									<option value='SAM'>SAM</option>
									<option value='MENA'>MENA</option>
									<option value='OCE'>OCE</option>
									<option value='APAC'>APAC</option>
									<option value='SSA'>SSA</option>
								</select>
							</div>
						</div>
					</div>
					<Button type="submit">Submit</Button>
				</form>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}


export default regionUpdate