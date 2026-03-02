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
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='center' textSize='2' textWeight='bold'>
			<div className='slide-in-elliptic-bottom-bck'>
				<div className='text-focus-in'>Welcome to the game TransDungeon</div>
				<br/>
				<div className='button-group'>
					<NavLink to="/login" className="button is-primary is-medium is-outlined heartbeat">Sign in</NavLink>
					<NavLink to="/register" className="button is-primary is-medium is-outlined heartbeat">Sign up</NavLink>
				</div>
			</div>
		</Box>
	)
}

export default App
