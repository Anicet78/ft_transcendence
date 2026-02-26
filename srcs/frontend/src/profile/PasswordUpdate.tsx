import { Box, Button } from "@allxsmith/bestax-bulma"
import "../auth/register.css"

import { NavLink, useNavigate } from "react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetBody } from '../types/GetType.ts';
import api from '../serverApi.ts';
import toast from "../Notifications.tsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputPassword from "../components/InputPassword.tsx";

//TODO
type ProfileUpdateBodyType = GetBody<"/profile/password", "patch">;

interface FormValues {
	oldPassword: string;
	password: string;
	confirmPassword: string;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const schema = yup.object({
	oldPassword: yup
		.string()
		.min(8)
		.required("Password is required"),
	password: yup
		.string()
		.matches(passwordRegex, "Minimum 8 characters, uppercase, lowercase, number & special")
		.required("Password is required"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm password is required"),
});

const PasswordUpdate = () => {
	const queryClient = useQueryClient();
	let navigate = useNavigate();

	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
		resolver: yupResolver(schema),
	});

	const password = watch("password");
	const confirmPassword = watch("confirmPassword");

	const mutation = useMutation({
		mutationFn: (data: { oldPassword: string; newPassword: string }) =>
			api.patch("/profile/password", data),
		onSuccess: (data) => {
		queryClient.setQueryData(["profile"], data);
		navigate("/profile")
		toast({title: 'Success', message: 'Password updated successfully!', type: 'is-success'})
		},
		onError: (error: any) => {
			toast({ title: 'Error', message: error.message || 'Failed to update password', type: 'is-warning' });
    }
	});

	const onSubmit = (data: FormValues) => {
		mutation.mutate({
			oldPassword: data.oldPassword,
			newPassword: data.password
		});
	};

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Change profile</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<div className="register-box">
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputPassword
							placeholder="Current password"
							register={register("oldPassword")}
						/>
						<InputPassword
							placeholder="New password"
							register={register("password")}
							error={errors.password}
							watchValue={password}
						/>
						<InputPassword
							placeholder="Confirm new password"
							register={register("confirmPassword")}
							error={errors.confirmPassword}
							watchValue={confirmPassword}
						/>
						<Button type="submit">{mutation.isPending ? 'Updating...' : 'Update Password'}</Button>
					</form>
				</div>
			</Box>
			<NavLink to="/profile" className="button is-medium">Back to profile</NavLink>
		</Box>
	)
}

export default PasswordUpdate