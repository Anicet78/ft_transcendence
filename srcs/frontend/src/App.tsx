import { NavLink, useNavigate } from 'react-router'
import { useAuth } from './auth/AuthContext'
import { useEffect } from 'react'

const App = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

	useEffect(() => {
		if (user) navigate('/home')
	}, [user, navigate])

	return (
		<div className="landing-hero">
		<p className="landing-hero__eyebrow">Welcome to</p>
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			maxWidth: '100vw',
			overflow: 'hidden'
			}}>
				<span className="landing-hero__title">Dungeon</span>
				<span className="landing-hero__title accent">NoDragon</span>
		</div>
		<p className="landing-hero__subtitle">
			Enter the maze. Defeat the goblins. Be the first one to escape.
		</p>
		<div className="landing-hero__actions">
			<NavLink to="/login" className="button is-ghost is-medium">Sign in</NavLink>
			<NavLink to="/register" className="button is-primary is-medium">Sign up</NavLink>
		</div>
		</div>
	)
}

export default App