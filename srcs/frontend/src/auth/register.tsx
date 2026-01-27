import { useState, StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css'
import './index.css'

import { Button } from '@allxsmith/bestax-bulma';
import { Server } from '../server.ts'
import Banner from '../components/Banner.tsx';
import ButtonSubmit from '../components/ButtonSubmit.tsx';
import InputEmail from '../components/InputEmail.tsx';
import InputPassword from '../components/InputPassword.tsx';
import InputName from '../components/InputName.tsx';

function Register() {
  const server = Server.getInstance();
  const [token, setToken] = useState<string | undefined>(undefined);

  function register(formData) {

	const fname = formData.get("firstname");
	const lname = formData.get("lastname");
	const uname = formData.get("username");
	const email = formData.get("email");
	const pwd = formData.get("pwd");

	server.register(fname, lname, uname, email, pwd).then((data) => {
		setToken(data.token);
	})
  }

  console.log("app token is", token);

  return (
    <>
      {/* ce qui est entre les accolades ne sont pas des elements html, comme ce commentaire qui est en ts */}
      <h1><Banner /></h1>
      <div className="card">
		<div>
			<Button color='primary' isOutlined>Login with Google</Button>
			<Button color='primary' isOutlined>Login with 42</Button>
		</div>
		<br />
        <form action={register} className='form'>
			<div>
				<div className="field">
					<label htmlFor="text">First name</label>
					<InputName nameType="firstname" />
				</div>
				<div className="field">
					<label htmlFor="text">Last name</label>
					<InputName nameType="lastname"/>
				</div>
				<div className="field">
					<label htmlFor="text">User name</label>
					<InputName nameType="username"/>
				</div>
				<div className="field">
					<label htmlFor="region">Region</label>
					<div className="control has-icons-left">
						<div className="select">
							<div className="icon is-small is-left">
							<i className="fas fa-globe"></i>
							</div>
							<select id='region' name='region'>
							<option defaultValue='EU'>Select your region</option>
							<option value='EU'>EU</option>
							<option value='NA'>NA</option>
							<option value='SAM'>SAM</option>
							<option value='MENA'>MENA</option>
							<option value='OCE'>OCE</option>
							<option value='APAC'>APAC</option>
							<option value='SSA'>SSA</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<br />
			<div>
				<InputEmail />
				<div className="field">
					<label htmlFor="password">Password</label>
					<InputPassword />
				</div>
				<div className="field">
					<label htmlFor="password">Confirm password</label>
					<InputPassword />
				</div>
				<br />
			</div>
            <ButtonSubmit name='Sign up' />
        </form>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Register />
  </StrictMode>,
)
