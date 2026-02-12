import './App.css'
import { Box } from '@allxsmith/bestax-bulma';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from './auth/AuthContext';
import { useEffect } from 'react';

const App = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		if (user)
			navigate("/home");
	}, [])

	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' textSize='2' textWeight='bold'>
			<div>Welcome to the game Dungeon</div>
			<br/>
			<div>
				<NavLink to="/login" className="button is-dark is-medium is-outlined">Sign in</NavLink>
				<NavLink to="/register" className="button is-dark is-medium is-outlined">Sign up</NavLink>
			</div>
		</Box>
	)
}

export default App
