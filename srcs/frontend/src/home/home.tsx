import './home.css'
import '../App.css'
import { Box, Button } from '@allxsmith/bestax-bulma';

import { useRoom } from './RoomContext.tsx';


const Home = () => {
	const { room } = useRoom()!;

	if (!room || !room.playersId) return <p>Room not ready...</p>;

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			{room.playersId.map((name: string) => (
				<p>{name}</p>
			))}
			<Button color='primary' isInverted aria-label='spectate button' size='medium'>Launch game</Button>
		</Box>
	)
}

export default Home