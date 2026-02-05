import '../App.css'
import './profile.css'
import { Box, Button } from '@allxsmith/bestax-bulma';

const ProfilePrivate = () => {
	const username = 'My username'
	const avatar = '../assets/skull.svg'
	const level = '0'
	const xp = '0'
	const firstname = 'My first name'
	const lastname = 'My last name'
	const email = 'My email'
	const loginGoogle = 'My Google login'
	const login42 = 'My 42 login'
	const password = '**********'
	const bestTime = 0
	const maxKill = 0
	const totalGames = 0
	const totalWins = 0
	const totalLoses = 0

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			<h1>Welcome to your profile page</h1>
			<br/>
			<Box className='box-head' bgColor="white" justifyContent='center' textSize='4'>
				<Box bgColor='white' className='image-box'>
					<figure className='image is-128x128'>
						<img aria-label='avatar of the user' src={avatar} />
					</figure>
				</Box>
				<Box className='head-text'>
					<span className="icon-text">
						<span>{username}</span>
						<span className="icon">
							<i className="fas fa-pen"></i>
						</span>
					</span>
					<p>Lvl {level}</p>
					<p>{xp} XP</p>
				</Box>
			</Box>
			<Box className='info' bgColor="white" textSize='5'>
				<p>First name: {firstname}</p>
				<p>Last name: {lastname}</p>
				<p>
					Email: {email}
					<span className="icon-text">
						<span className="icon">
							<i className="fas fa-pen"></i>
						</span>
					</span>
				</p>
				<p>Login Google: {loginGoogle}</p>
				<p>Login 42: {login42}</p>
				<p>
					Password: {password}
					<span className="icon-text">
						<span className="icon">
							<i className="fas fa-pen"></i>
						</span>
					</span>
				</p>
				<p>Best time: {bestTime}</p>
				<p>Max ennemies killed: {maxKill}</p>
				<p>Total games: {totalGames}</p>
				<p>Total wins: {totalWins}</p>
				<p>Total loses: {totalLoses}</p>
			</Box>
		</Box>
	)
}

export default ProfilePrivate