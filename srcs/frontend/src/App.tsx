import { useState } from 'react'
import { Button } from '@allxsmith/bestax-bulma'; // quand on exporte pas en default mettre des accolades
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
  const [count, setCount] = useState<number>(0); // number = equivalent typescript de int
  const [token, setToken] = useState<string | undefined>(undefined);

  // that's how you define a function
  const increaseCount = () => {
    setCount(count + 1);
  }

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
          <p>
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              required
              minLength={3}
              maxLength={80}
            />

            <br />

            <label htmlFor="pwd">Password</label>
            <br />
            <input
              type="password"
              id="pwd"
              name="pwd"
              required
              minLength={8}
            />
          </p>
          <br />
          <p>
            <ButtonSubmit />
          </p>
        </form>
        <p>
          <Button color="primary" onClick={increaseCount}> {/*onClick attend une fonction qui va etre appele quand on clique, qui ne prend pas d'argument*/}
          count is {count}
          </Button>
        </p>
      </div>
    </>
  )
}

export default App
