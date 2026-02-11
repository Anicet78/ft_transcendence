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

type RegisterBodyType = GetBody<"/auth/register", "post">;
type RegisterResponseType = GetResponse<"/auth/register", "post">;

function Register() {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: RegisterBodyType) => api.post("/auth/register", data),
    onSuccess: (data) => {
      const response: RegisterResponseType = data.data;
      login(response.user, response.token);
    },
  });

	function registerAction(formData: FormData) {

		const fname = formData.get("firstname");
		const lname = formData.get("lastname");
		const uname = formData.get("username");
		const email = formData.get("email");
		const region = formData.get("region");
		const pwd = formData.get("pwd");

		if (!fname || !lname || !uname || !email || !region || !pwd) return ;

		mutation.mutate({
		firstname: fname.toString(),
		lastname: lname.toString(),
		username: uname.toString(),
		email: email.toString(),
		region: region.toString() as RegisterBodyType['region'],
		password: pwd.toString()
		});
	}

	return (
		<>
		<div className="card">
			<div>
			<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
			<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
			</div>
			<br />
			<form action={registerAction}>
			<div className='inputs'>
				<InputName label="First name" nameType="firstname" />
				<InputName label="Last name" nameType="lastname"/>
				<InputName label="User name" nameType="username"/>
				<InputEmail label="Email" />
				<InputPassword label="Password" id="pwd"/>
			</div>
			<div>
				<SelectRegion />
				<ButtonSubmit name='Sign up' />
			</div>
			</form>
		</div>
		</>
	)
}

export default Register