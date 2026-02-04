import { useState } from 'react'
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css'
import '../index.css'

import { Button } from '@allxsmith/bestax-bulma';
import { Server } from '../server.ts'
import ButtonSubmit from '../components/ButtonSubmit.tsx';
import InputEmail from '../components/InputEmail.tsx';
import InputPassword from '../components/InputPassword.tsx';
import InputName from '../components/InputName.tsx';
import SelectRegion from '../components/SelectRegion.tsx';

function Register() {
  const server = Server.getInstance();
  const [token, setToken] = useState<string | undefined>(undefined);

  function register(formData) {

	const fname = formData.get("firstname");
	const lname = formData.get("lastname");
	const uname = formData.get("username");
	const email = formData.get("email");
	const region =formData.get("region")
	const pwd = formData.get("pwd");

	server.register(fname, lname, uname, email, region, pwd).then((data) => {
		setToken(data.token);
	})
  }

  console.log("app token is", token);

  return (
    <>
      <div className="card">
		<div>
			<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
			<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
		</div>
		<br />
        <form action={register}>
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