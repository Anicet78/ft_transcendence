import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css'
import './login.css'

import { Button, Box } from '@allxsmith/bestax-bulma';
import type { GetBody, GetResponse } from '../types/GetType.ts';
import api from '../serverApi.ts';
import { useMutation } from '@tanstack/react-query';
import type {UseMutationResult} from '@tanstack/react-query';
import { useAuth } from './AuthContext.tsx';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputText from '../components/InputText.tsx';
import InputPassword from '../components/InputPassword.tsx';
import SelectRegion from '../components/SelectRegion.tsx';
import toast from '../Notifications.tsx';

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

	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
		resolver: yupResolver(schema),
	});

	const password = watch("password");
	const confirmPassword = watch("confirmPassword");

	const mutation: UseMutationResult<RegisterResponseType, any, RegisterBodyType> = useMutation({
		mutationFn: (data: RegisterBodyType) => api.post("/auth/register", data),
		onSuccess: (data) => {
			const response: RegisterResponseType = data;
			toast({ title: `Your account has been successfully created`, type: "is-success" })
			login(response.user, response.token);
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		}
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
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='center' textSize='3' textWeight='bold'>
			<div className="register-box">
				<div className='social-buttons'>
					<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
					<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
				</div>
				<br />
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-fields">
						<InputText placeholder="First name" register={register("firstname")} error={errors.firstname} />
						<InputText placeholder="Last name" register={register("lastname")} error={errors.lastname} />
						<InputText placeholder="Username" register={register("username")} error={errors.username} />
						<InputText placeholder="Email" type="email" register={register("email")} error={errors.email} />

						<InputPassword placeholder="Password" register={register("password")} error={errors.password} watchValue={password} />
						<InputPassword placeholder="Confirm password" register={register("confirmPassword")} error={errors.confirmPassword} watchValue={confirmPassword} />
					</div>
					<div className='bottom'>
						<SelectRegion placeholder="Select Region" options={regions} register={register("region")} error={errors.region} />
						<Button type="submit" color="primary" isOutlined className="submit-wrapper">{mutation.isPending ? 'Registering...' : 'Sign up'}</Button>
					</div>
				</form>
			</div>
		</Box>
	)
}

export default Register