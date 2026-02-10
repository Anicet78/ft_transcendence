import '../App.css'
import './profile.css'
import { Box, Button } from '@allxsmith/bestax-bulma';
import { useParams } from 'react-router';

const ProfilePublic = () => {
	const id = useParams() // friend request and remove friend: path="/friends/${id}"
	const username = 'Username'
	const avatar = '../assets/skull.svg'
	const level = '0'
	const xp = '0'
	const isConnected = true // for the person viewing the public profile
	const friendshipStatus = 'accepted' // between the person viewing and the profile owner
	let buttonText = ''
	let disable = false
	let inverted = true
	let mycolor = 'primary'
	const bestTime = 0
	const maxKill = 0
	const totalGames = 0
	const totalWins = 0
	const totalLoses = 0

	if (friendshipStatus === 'waiting')
	{
		buttonText = "Request pending"
		disable = true
		inverted = false
		mycolor = 'dark'
	}
	else if (friendshipStatus === 'accepted')
		buttonText = 'Revoke friendship'

	else if (friendshipStatus === 'refused')
	{
		buttonText = "Request denied"
		disable = true
		inverted = false
		mycolor = 'danger'
	}
	else
	{
		buttonText = "Friend request"
		disable = false
		inverted = true
	}
	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			<h1>Welcome to {username} profile page</h1>
			<br/>
			<Box className='box-head' bgColor="white" justifyContent='center' textSize='4'>
				<Box bgColor='white' className='image-box'>
					<figure className='image is-128x128'>
						<img aria-label='avatar of the user' src={avatar} />
					</figure>
				</Box>
				<Box className='head-text'>
					<p>{username}</p>
					<p>Lvl {level}</p>
					<p>{xp} XP</p>
				</Box>
			</Box>
			<Box className='info' bgColor="white" textSize='5'>
				<p>Best time: {bestTime}</p>
				<p>Max ennemies killed: {maxKill}</p>
				<p>Total games: {totalGames}</p>
				<p>Total wins: {totalWins}</p>
				<p>Total loses: {totalLoses}</p>
			</Box>
			<div>
				<Button color={mycolor} isInverted={inverted} disabled={disable} size='large'>{buttonText}</Button>
			</div>
			<div>
				<Button color='primary' isInverted aria-label='join button' size='medium'>Join / decline</Button>
				<br />
				<Button color='primary' isInverted aria-label='spectate button' size='medium'>Spectate</Button>
			</div>
		</Box>
	)
}

export default ProfilePublic