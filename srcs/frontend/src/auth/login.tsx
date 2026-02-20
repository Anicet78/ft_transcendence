import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css'
import '../index.css'

import { Button } from '@allxsmith/bestax-bulma';
import ButtonSubmit from '../components/ButtonSubmit.tsx';
import InputEmail from '../components/InputEmail.tsx';
import { useMutation } from '@tanstack/react-query';
import api from '../serverApi.ts';

import type { GetBody, GetResponse } from '../types/GetType.ts';
import { useAuth } from './AuthContext.tsx';
import { useState } from 'react';
import toast from '../Notifications.tsx';

type LoginBodyType = GetBody<"/auth/login", "post">;
type LoginResponseType = GetResponse<"/auth/login", "post">;

function Login() {
	const { login } = useAuth();

	const mutation = useMutation({
		mutationFn: (data: LoginBodyType) => api.post("/auth/login", data),
		onSuccess: (data) => {
			const response: LoginResponseType = data.data;
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	const GOOGLE_CLIENT_ID = window._env_?.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const FORTYTWO_CLIENT_ID = window._env_?.VITE_42_CLIENT_ID || import.meta.env.VITE_42_CLIENT_ID;
	const REDIRECT_URI = "http://localhost:5173/callback"; // change with https://localhost:8443/callback
	const SCOPE = "openid email profile";

	const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
		`client_id=${GOOGLE_CLIENT_ID}&` +
		`redirect_uri=${encodeURIComponent(REDIRECT_URI)}Google&` +
		`response_type=code&` +
		`scope=${encodeURIComponent(SCOPE)}&` +
		`access_type=offline&` +
		`prompt=consent`;

	const fortyTwoUrl = `https://api.intra.42.fr/oauth/authorize?` +
		`client_id=${FORTYTWO_CLIENT_ID}&` +
		`redirect_uri=${encodeURIComponent(REDIRECT_URI)}42&` +
		// `scope=${encodeURIComponent(SCOPE)}&` +
		`response_type=code`

	const handleGoogleLogin = () => {
		if (!GOOGLE_CLIENT_ID)
			toast({ title: "Redirection error", message: "Google identifiers are not setup", type: "is-danger" });
		else
			window.location.href = googleUrl;
	}

	const handle42Login = () => {
		if (!FORTYTWO_CLIENT_ID)
			toast({ title: "Redirection error", message: "42 identifiers are not setup", type: "is-danger" });
		else
			window.location.href = fortyTwoUrl;
	}

	return (
		<>
			<div className="card">
				<div>
				<Button color='primary' isOutlined className='login-button' onClick={handleGoogleLogin}>Login with Google</Button>
				<Button color='primary' isOutlined className='login-button' onClick={handle42Login}>Login with 42</Button>
				</div>
				<br />
				<form onSubmit={loginSubmit}>
					<InputEmail label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email"/>
					<div className="field">
						<label htmlFor="password">Password</label>
						<p className="control has-icons-left">
							<input
								className="input"
								type="password"
								id="password"
								name="password"
								required
								minLength={3}
								maxLength={80}
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
							/>
							<span className="icon is-small is-left">
								<i className="fas fa-lock"></i>
							</span>
						</p>
					</div>
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