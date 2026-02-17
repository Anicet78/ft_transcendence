import './home.css'
import '../App.css'

import type { GetResponse } from '../types/GetType.ts';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import api from '../serverApi.ts';
import { useRoom } from './RoomContext.tsx';
import { useEffect } from 'react';

export type Room = GetResponse<"/room/new", "post">;

const JoinRoom = () => {
	const navigate = useNavigate();
	const roomId = useParams().roomId;
	const { joinRoom } = useRoom()!;

	const mutation = useMutation({
		mutationFn: () => api.post(`/room/${roomId}/join`),
		onSuccess: (data) => {
			const newRoom: Room = data.data;
			joinRoom(newRoom);
			navigate("/home");
			return ;
		},
	});

	useEffect(() => {
		mutation.mutate();
		navigate("/home");
	}, [])

	if (mutation.isPending) return <p>Joining room...</p>;

	return (
		<p style={{ color: 'red' }}>
			An error occurred{mutation.isError ? ` (${mutation.error.message})`: ''}, please refresh.
		</p>
	)
}

export default JoinRoom
