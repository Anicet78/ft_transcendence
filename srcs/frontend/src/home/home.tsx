import '../App.css'
import { Box } from '@allxsmith/bestax-bulma';

import { useMutation } from '@tanstack/react-query';
import api from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts';
import { useEffect, useState } from 'react';
import { useSocket } from '../socket/SocketContext.tsx';

export type Room = GetResponse<"/room/new", "post">;

const Home = () => {
	const socket = useSocket();
	const [room, setRoom] = useState<any>(null);

	const mutation = useMutation({
		mutationFn: () => api.post(room?.roomId ? `/room/${room?.roomId}` : "/room/new"),
		onSuccess: (data) => {
			setRoom(data.data);
		},
	});

	useEffect(() => {
		mutation.mutate();
	}, []);

	useEffect(() => {
		if (!socket || !room?.roomId) return;

		/* socket.on('user_joined', (data) => {
			console.log("Un nouvel utilisateur est là :", data);
		});

		return () => {
			socket.off('user_joined');
		}; */
	}, [socket, room?.roomId]);

	if (mutation.isPending) return <p>Creating or joining room...</p>;

	if (mutation.error) return (
		<p style={{ color: 'red' }}>
			An error occurred ({mutation.error.message}), please refresh.
		</p>
	);

	return (
		<Box>
			<p>content</p>
		</Box>
	)
}

export default Home