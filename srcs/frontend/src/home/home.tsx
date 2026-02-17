import './home.css'
import '../App.css'
import { Box, Button } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';

import { useRoom } from './RoomContext.tsx';
import { useAuth } from '../auth/AuthContext.tsx';
import api, { ServerUrl } from '../serverApi.ts';
import { PlayerDropdown } from '../components/PlayerDropdown.tsx';
import { useMutation } from '@tanstack/react-query';
import toast from '../Notifications.tsx';

const Home = () => {
	const { user } = useAuth();
	const { room, newRoom } = useRoom()!;

	const kickMutation = useMutation({
		mutationFn: (userId: string) => api.post(`/room/${room?.roomId}/kick`, { userId })
	});

	const hostMutation = useMutation({
		mutationFn: (userId: string) => api.post(`/room/${room?.roomId}/host`, { userId })
	});

	if (!room || !room.players) return <p>Room not ready...</p>;

	const QuitRoom = () => {
		newRoom();
		toast({ title: "Room quitted", message: "You've been added in a new room", type: "is-info" });
	}

	const CopyRoomUrl = () => {
		navigator.clipboard.writeText(`http://localhost:5173/join/${room.roomId}`); // `${ServerUrl}/join/${room.roomId}`
		toast({ title: "Link copied", message: "The room link has been copied to clipboard", type: "is-info" });
	}

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			{room.players.map((player) => (
				<PlayerDropdown key={player.username} player={player} kickFn={kickMutation.mutate} hostFn={hostMutation.mutate} isHost={user?.id == room.hostId} isSelf={user?.id == player.id}/>
			))}
			{room.hostId === user?.id &&
				<NavLink to="/game" color='primary' className='button is-dark is-medium is-outlined' aria-label='spectate button'>Launch Game</NavLink>
			}
			<Button color='link' className='button is-dark is-medium is-outlined' aria-label='spectate button' onClick={QuitRoom}>Quit room</Button>
			<Button color='link' className='button is-dark is-medium is-outlined' aria-label='spectate button' onClick={CopyRoomUrl}>Copy invite link</Button>
		</Box>
	)
}

export default Home
