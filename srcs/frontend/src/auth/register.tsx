import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css'
import '../index.css'

import { Button } from '@allxsmith/bestax-bulma';
import type { GetBody, GetResponse } from '../types/GetType.ts';
import api from '../serverApi.ts';
import { useMutation } from '@tanstack/react-query';
import type {UseMutationResult} from '@tanstack/react-query';
import { useAuth } from './AuthContext.tsx';
<<<<<<< HEAD
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputText from '../components/InputText.tsx';
import InputPassword from '../components/InputPassword.tsx';
import SelectRegion from '../components/SelectRegion.tsx';
=======
import { useState } from 'react';
>>>>>>> a78a13d (Fix password don't match)

type RegisterBodyType = GetBody<"/auth/register", "post">;
type RegisterResponseType = GetResponse<"/auth/register", "post">;
export type Region = RegisterBodyType["region"];

// Region
type RegionType = RegisterBodyType['region']
const regions: RegionType[] = ["EU", "NA", "SAM", "MENA", "OCE", "APAC", "SSA", "Deleted"];

// Regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/;
const realnameRegex = /^[a-zA-Z]{2,20}$/;

// Yup validation schema
const schema = yup.object().shape({
	firstname: yup
		.string()
		.matches(realnameRegex, "2-20 characters: letters")
		.required("First name is required"),
	lastname: yup
		.string()
		.matches(realnameRegex, "2-20 characters: letters")
		.required("First name is required"),
	username: yup
		.string()
		.matches(usernameRegex, "3-20 characters: letters, numbers, underscores")
		.required("User name is required"),
	email: yup
		.string()
		.email("Invalid email")
		.required("Email is required"),
	password: yup
		.string()
		.matches(passwordRegex, "Minimum 8 characters, uppercase, lowercase, number & special")
		.required("Password is required"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm password"),
	region: yup
		.mixed<RegionType>()
    	.oneOf(regions, "Invalid region selected")
    	.required("Please select a region"),
});

interface FormValues {
	firstname: string,
	lastname: string,
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	region: RegionType;
}

function Register() {
	const { login } = useAuth();

<<<<<<< HEAD
	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    	resolver: yupResolver(schema),
	});

	const password = watch("password");
	const confirmPassword = watch("confirmPassword");

	const mutation: UseMutationResult<RegisterResponseType, any, RegisterBodyType> = useMutation({
		mutationFn: (data: RegisterBodyType) => api.post("/auth/register", data),
		onSuccess: (data) => {
		const response: RegisterResponseType = data;
		toast.success(`You registered successfully!`);
		login(response.user, response.token);
		},
		onError: (err: any) => toast.error(err.response?.data?.error || "Registration failed"),
	});

	const onSubmit = (data: FormValues) => {
		const RegisterBody: RegisterBodyType = {
			firstname: data.firstname,
			lastname: data.lastname,
			username: data.username,
			email: data.email,
			password: data.password,
			region: data.region,
		};

		mutation.mutate(RegisterBody);
	};

	return (
		<>
			<Toaster
				position="top-right"
				toastOptions={{
				style: { fontSize: "14px" },
				success: { duration: 3000 },
				error: { duration: 5000 },
				}}
			/>
			<div className="card">
				<div>
				<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
				<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
				</div>
				<br />
				<form onSubmit={handleSubmit(onSubmit)} className='register_form'>
					<InputText placeholder="Firstname" register={register("firstname")} error={errors.firstname} />
					<InputText placeholder="Lastname" register={register("lastname")} error={errors.lastname} />
					<InputText placeholder="Username" register={register("username")} error={errors.username} />
					<InputText placeholder="Email" type="email" register={register("email")} error={errors.email} />

					<InputPassword placeholder="Password" register={register("password")} error={errors.password} watchValue={password} />
					<InputPassword placeholder="Confirm Password" register={register("confirmPassword")} error={errors.confirmPassword} watchValue={confirmPassword} />

					<SelectRegion placeholder="Select Region" options={regions} register={register("region")} error={errors.region} />

					<button type="submit" disabled={mutation.status === 'pending'}>{mutation.status === 'pending' ? "Registering..." : "Sign up"}</button>
				</form>
			</div>
<<<<<<< HEAD
		</>
=======
			<br />
			<form onSubmit={registerSubmit}>
			<div className='inputs'>
				<InputName label="First name" type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="Firstname" />
				<InputName label="Last name" type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Lastname" />
				<InputName label="User name" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
				<InputEmail label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@transcendence.com" />
				<InputPassword label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" />
				<InputPassword label="Confirm password" type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••••••" />
			</div>
			<div>
				<br></br>
				<SelectRegion />
				{passwordError && <span>Password don't match</span>}
				<br></br>
				<ButtonSubmit name='Sign up' />
			</div>
			</form>
		</div>
>>>>>>> a78a13d (Fix password don't match)
	)
}

export default Register
