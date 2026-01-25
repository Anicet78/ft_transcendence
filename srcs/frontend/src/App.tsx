import { useState } from 'react'
import { Button } from '@allxsmith/bestax-bulma'; // quand on exporte pas en default mettre des accolades
import reactLogo from './assets/react.svg'
import viteLogo from '../public/vite.svg'
import './App.css'

import { Server } from './server.ts'
import { Navbar } from './navigation_bar.tsx'

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
      <div>
        <a href="https://vite.dev" target="_blank">
        {/* ce qui est entre les accolades ne sont pas des elements html, comme ce commentaire qui est en ts */}
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button color="primary" onClick={increaseCount}> {/*onClick attend une fonction qui va etre appele quand on clique, qui ne prend pas d'argument*/}
          count is {count}
        </Button>

        <form action={login}>
          <label for="email">Email</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            required
            minlength="3"
            maxlength="80"
          />

          <br />

          <label for="pwd">Password</label>
          <br />
          <input
            type="password"
            id="pwd"
            name="pwd"
            required
            minlength="8"
          />
          <button type="submit">Login</button>
        </form>


        <Navbar token={token} />
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
