import { useState, StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css'
import '../index.css'

import { Button } from '@allxsmith/bestax-bulma';
import { Server } from '../server.ts'
import Banner from '../components/Banner.tsx';
import ButtonSubmit from '../components/ButtonSubmit.tsx';
import InputEmail from '../components/InputEmail.tsx';
import InputPassword from '../components/InputPassword.tsx';
import MyFooter from '../components/Footer.tsx';

/**
 * composant principal
 * comme tout composant il renvoie du html
 */
function Login() {
  const server = Server.getInstance();
  // useState -> count = objet qui sera modifie et setCount = fonction qui va modifier la valeur de l'objet
//   const [count, setCount] = useState<number>(0); // number = equivalent typescript de int
  const [token, setToken] = useState<string | undefined>(undefined);

  // that's how you define a function
//   const increaseCount = () => {
//     setCount(count + 1);
//   }

  function login(formData) {
      const email = formData.get("email");
      const pwd = formData.get("pwd");

      server.login(email, pwd).then((data) => {
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
			<Button color='primary' isOutlined className='login-button'>Login with Google</Button>
			<Button color='primary' isOutlined className='login-button'>Login with 42</Button>
		</div>
		<br />
        <form action={login}>
			<InputEmail label="Email"/>
			<InputPassword label="Password" id="pwd"/>
            <ButtonSubmit name='Sign in' />
        </form>
      </div>
	  <MyFooter />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
