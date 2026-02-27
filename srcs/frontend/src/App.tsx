import './App.css'
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
		<div className='slide-in-elliptic-bottom-bck'>
			<div className='text-focus-in'>
				<p> Welcome to the game</p>
				<p>TransDungeon</p>
				</div>
			<br/>
			<div className='button-group'>
				<NavLink to="/login" className="button is-primary is-medium is-outlined heartbeat">Sign in</NavLink>
				<NavLink to="/register" className="button is-primary is-medium is-outlined heartbeat">Sign up</NavLink>
			</div>
		</div>
	)
}

export default App
