import './App.css'
import { Box } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';

const App = () => {
	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' textSize='2'>
			<div>Welcome to the game TransDungeon</div>
			<br/>
			<div>
				<NavLink to="/login" className="button is-dark is-medium is-outlined">Sign in</NavLink>
				<NavLink to="/register" className="button is-dark is-medium is-outlined">Sign up</NavLink>
			</div>
		</Box>
	)
}

export default App
