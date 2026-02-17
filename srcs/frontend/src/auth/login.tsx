import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css'
import '../index.css'

import { Button } from '@allxsmith/bestax-bulma';
import ButtonSubmit from '../components/ButtonSubmit.tsx';
import InputEmail from '../components/InputEmail.tsx';
import InputPassword from '../components/InputPassword.tsx';
import { useMutation } from '@tanstack/react-query';
import api from '../serverApi.ts';

import type { GetBody, GetResponse } from '../types/GetType.ts';
import { useAuth } from './AuthContext.tsx';
import { useState } from 'react';
import toast from '../Notifications.tsx';
import { useNavigate } from 'react-router';

type LoginBodyType = GetBody<"/auth/login", "post">;
type LoginResponseType = GetResponse<"/auth/login", "post">;

function Login() {
	const { login } = useAuth();

	const mutation = useMutation({
		mutationFn: (data: LoginBodyType) => api.post("/auth/login", data),
		onSuccess: (data) => {
			const response: LoginResponseType = data.data;
			toast({ title: `Welcome ${response.user.username}` })
			login(response.user, response.token);
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		}
	});

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const loginSubmit = (e) => {
		e.preventDefault();
		mutation.mutate({ email: formData.email, password: formData.password });
	};

	const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const REDIRECT_URI = "http://localhost:5173/callback"; // change with https://localhost:8443/callback
	const SCOPE = "openid email profile";

	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
		`client_id=${CLIENT_ID}&` +
		`redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
		`response_type=code&` +
		`scope=${encodeURIComponent(SCOPE)}&` +
		`access_type=offline&` +
		`prompt=consent`;

	const handleLogin = () => {
		if (!CLIENT_ID)
			toast({ title: "Redirection error", message: "Google identifiers are not setup", type: "is-danger" });
		else
			window.location.href = authUrl;
	}

	return (
		<>
			<div className="card">
				<div>
				<Button color='primary' isOutlined className='login-button' onClick={handleLogin}>Login with Google</Button>
				<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
				</div>
				<br />
				<form onSubmit={loginSubmit}>
					<InputEmail label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@transcendence.com" />
					<InputPassword label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" />

					{mutation.isError && (
						<div style={{ color: 'red' }}>
							Erreur : {mutation.error instanceof Error ? mutation.error.message : 'Unknown'}
						</div>
					)}
					<ButtonSubmit
						name={mutation.isPending ? 'Loading...' : 'Sign in'}
					/>
				</form>
			</div>
		</>
	)
}

export default Login
