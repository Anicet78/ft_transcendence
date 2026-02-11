import './home.css'
import '../App.css'
import { Box } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';

import { useRoom } from './RoomContext.tsx';
import { useAuth } from '../auth/AuthContext.tsx';

const Home = () => {
	const { user } = useAuth();
	const { room } = useRoom()!;

	if (!room || !room.playersId) return <p>Room not ready...</p>;

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			{room.playersId.map((name: string) => (
				<p>{name}</p>
			))}
			{room.hostId === user?.id &&
				<NavLink to="/game" color='primary' className="button is-dark is-medium is-outlined" aria-label='spectate button'>Launch Game</NavLink>
			}
		</Box>
	)
}

export default Home