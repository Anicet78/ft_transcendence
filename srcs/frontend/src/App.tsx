import { useState } from 'react'
// import { Button } from '@allxsmith/bestax-bulma'; // quand on exporte pas en default mettre des accolades
import './App.css'

import { Server } from './server.ts'
import Banner from './components/Banner.tsx';
import ButtonSubmit from './components/ButtonSubmit.tsx';

/**
 * composant principal
 * comme tout composant il renvoie du html
 */
function App() {
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
        <form action={login}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <p className="control has-icons-left">
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                required
                minLength={3}
                maxLength={80}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <label htmlFor="password">Pasword</label>
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="pwd"
                name="pwd"
                required
                minLength={8}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <p>
            <ButtonSubmit />
          </p>
        </form>
      </div>
    </>
  )
}

export default App
