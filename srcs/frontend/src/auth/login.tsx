import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css'
import '../index.css'

import { Button, Box } from '@allxsmith/bestax-bulma';
import InputEmail from '../components/InputEmail.tsx';
import { useMutation } from '@tanstack/react-query';
import api from '../serverApi.ts';

import type { GetBody, GetResponse } from '../types/GetType.ts';
import { useAuth } from './AuthContext.tsx';
import { useState } from 'react';
import toast from '../Notifications.tsx';
import { handleGoogleLogin } from './callbackGoogle.tsx';
import { handle42Login } from './callback42.tsx';

type LoginBodyType = GetBody<"/auth/login", "post">;
type ForgotBodyType = GetBody<"/auth/forgot-password", "post">;
type LoginResponseType = GetResponse<"/auth/login", "post">;


function Login() {
	const { login } = useAuth();

	const loginMutation = useMutation({
		mutationFn: (data: LoginBodyType) => api.post("/auth/login", data),
		onSuccess: (data) => {
			const response: LoginResponseType = data.data;
			login(response.user, response.token);
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		}
	});

	const forgotMutation = useMutation({
		mutationFn: (data: ForgotBodyType) => api.post("/auth/forgot-password", data),
		onSuccess: () => {
			toast({ title: "Email received", message: "An email to reset your password has been sent", type: 'is-info'});
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
		loginMutation.mutate({ email: formData.email, password: formData.password });
	};

	const onForgot = (e) => {
		if (!formData.email) {
			toast({ title: "Email not found", message: "Please enter your email before asking to reset it", type: 'is-warning' });
			return ;
		}
		forgotMutation.mutate({ email: formData.email });
	}

	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='center' textSize='3' textWeight='bold'>
			<div className='login-box'>
				<div className='social-buttons'>
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
					<Button type="button" color="primary" isOutlined className="submit-wrapper" onClick={onForgot}>Forgot Password</Button>
					{loginMutation.isError && (
						<div style={{ color: 'red' }}>
							{/* this part only show 'Error:' when nginx isn't running */}
							Error : {loginMutation.error instanceof Error ? loginMutation.error.message : 'Unknown'}
						</div>
					)}
					<Button type="submit" color="primary" isOutlined className="submit-wrapper">{loginMutation.isPending ? 'Loading...' : 'Sign in'}</Button>
				</form>
			</div>
		</Box>
	)
}

export default Login