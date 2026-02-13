import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css'
import '../index.css'

import { Button } from '@allxsmith/bestax-bulma';
import ButtonSubmit from '../components/ButtonSubmit.tsx';
import InputEmail from '../components/InputEmail.tsx';
import InputPassword from '../components/InputPassword.tsx';
import InputName from '../components/InputName.tsx';
import SelectRegion from '../components/SelectRegion.tsx';
import type { GetBody, GetResponse } from '../types/GetType.ts';
import api from '../serverApi.ts';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './AuthContext.tsx';
import { useState } from 'react';

type RegisterBodyType = GetBody<"/auth/register", "post">;
type RegisterResponseType = GetResponse<"/auth/register", "post">;
export type Region = RegisterBodyType["region"];

function Register() {
	const { login } = useAuth();

	const mutation = useMutation({
		mutationFn: (data: RegisterBodyType) => api.post("/auth/register", data),
		onSuccess: (data) => {
			const response: RegisterResponseType = data.data;
			login(response.user, response.token);
		},
	});

	const [formData, setFormData] = useState({
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		password: '',
		confirm_password: '',
		region: 'EU'
	});

	const [passwordError, setPasswordError] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));


		if (name === "confirm_password") {
			if (formData.password !== value)
				setPasswordError(true);
			else
				setPasswordError(false);
		}
		else if (name == "password") {
			if (value === formData.confirm_password)
				setPasswordError(false);
		}
	};

	const registerSubmit = (e) => {
		e.preventDefault();

		if (passwordError) return;

		mutation.mutate({
			firstname: formData.firstname,
			lastname: formData.lastname,
			username: formData.username,
			email: formData.email,
			password: formData.password,
			region: formData.region as Region
		});
	};

	return (
		<div className="card">
			<div>
			<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
			<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
			</div>
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
	)
}

export default Register