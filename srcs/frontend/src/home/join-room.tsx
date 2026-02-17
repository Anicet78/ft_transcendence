import './home.css'
import '../App.css'

import type { GetResponse } from '../types/GetType.ts';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import api from '../serverApi.ts';
import { useRoom } from './RoomContext.tsx';
import { useEffect } from 'react';
import toast from '../Notifications.tsx';

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
			toast({ title: `Added to room`, message: `You joined ${newRoom.players.find((player) => player.id === newRoom.hostId)?.username}'s room`, type: "is-success" })
			navigate("/home");
			return ;
		},
	});

	useEffect(() => {
		mutation.mutate();
	}, [])

	if (mutation.isPending) return <p>Joining room...</p>;

	if (mutation.isError) {
		toast({ title: `An error occurred`, message:`${mutation.isError ? mutation.error.message : 'Unknown error'}`, type: "is-warning" })
		navigate("/home");
		return ;
	}

	return (
		<p style={{ color: 'red' }}>
			An error occurred, please refresh.
		</p>
	)
}

export default JoinRoom
