import { useState } from 'react'
// import { Button } from '@allxsmith/bestax-bulma'; // quand on exporte pas en default mettre des accolades
import './App.css'
import Banner from './components/Banner.tsx';
import { Box, Button } from '@allxsmith/bestax-bulma';

const App = () => {
	return (
		<>
			<h1><Banner /></h1>
			<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<div>Welcome to the game TransDungeon</div>
				<br/>
				<div>
					<a href="./auth/login.html" className="button is-dark is-medium is-outlined">Sign in</a>
					<a href="./auth/register.html" className="button is-dark is-medium is-outlined">Sign up</a>
				</div>
			</Box>
		</>
	)
}

export default App
