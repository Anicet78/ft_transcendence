import { useNavigate } from 'react-router';
import { useRoom } from '../home/RoomContext';
import './game.css'
import { Box } from '@allxsmith/bestax-bulma';
import { useAuth } from '../auth/AuthContext';
import api from '../serverApi';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

const Game = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { room, start, cancelStart } = useRoom()!;

	const mutation = useMutation({
		mutationFn: () => api.post("/room/launch", room),
	});

	useEffect(() => {
		if (user?.id === room?.hostId)
			mutation.mutate();
		else if (!start) {
			navigate("/home");
			return ;
		}

		return () => cancelStart();
	}, []);

	if (mutation.isPending)
		return <div>Verifying room</div>

	if (mutation.isError) {
		navigate("/home");
		return ;
	}

	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
			<canvas id="game-canvas" width="800" height="950" tabIndex={1}></canvas>
		</Box>
	)
}

export default Game;