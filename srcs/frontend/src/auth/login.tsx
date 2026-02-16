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
  });

	const loginAction = (formData: FormData) => {
		let email = formData.get("email");
		let password = formData.get("pwd");

		if (!email || !password) return ;

		mutation.mutate({ email: email.toString(), password: password.toString() });
	};

	return (
		<>
			<div className="card">
				<div>
				<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
				<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
				</div>
				<br />
				<form action={loginAction}>
				<InputEmail label="Email"/>
				<div className="field">
					<label htmlFor="password">Password</label>
					<p className="control has-icons-left">
						<input
							className="input"
							type="password"
							id="pwd"
							name="pwd"
							required
							minLength={3}
							maxLength={80}
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
