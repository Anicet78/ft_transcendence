import './home.css'
import '../App.css'
import { Box, Button } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';

import { useRoom } from './RoomContext.tsx';
import { useAuth } from '../auth/AuthContext.tsx';
import { ServerUrl } from '../serverApi.ts';

const Home = () => {
	const { user } = useAuth();
	const { room, newRoom } = useRoom()!;

	if (!room || !room.playersId) return <p>Room not ready...</p>;

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			{room.playersId.map((name: string) => (
				<p>{name}</p>
			))}
			{room.hostId === user?.id &&
				<NavLink to="/game" color='primary' className='button is-dark is-medium is-outlined' aria-label='spectate button'>Launch Game</NavLink>
			}
			<Button color='primary' className='button is-dark is-medium is-outlined' aria-label='spectate button' onClick={newRoom}>Quit room</Button>
			{/* <Button color='primary' className='button is-dark is-medium is-outlined' aria-label='spectate button' onClick={() => {navigator.clipboard.writeText(`${ServerUrl}/join/${room.roomId}`)}}>Copy invite link</Button> */}
			<Button color='primary' className='button is-dark is-medium is-outlined' aria-label='spectate button' onClick={() => {navigator.clipboard.writeText(`http://localhost:5173/join/${room.roomId}`)}}>Copy invite link</Button>
		</Box>
	)
}

export default Home