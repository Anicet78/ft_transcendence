import { createContext, useContext, useEffect, useState } from 'react';
import api from '../serverApi';
import { useSocket } from '../socket/SocketContext';
import type { GetResponse } from '../types/GetType';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';

export type Room = GetResponse<"/room/new", "post">;

export type RoomContextValue = {
	room: Room | null;
	start: Boolean;
	joinRoom: (newRoom?: Room) => void;
	leaveRoom: () => void;
	newRoom: () => void;
	cancelStart: () => void;
};

const RoomContext = createContext<RoomContextValue | null>(null);

const onPlayerJoined = (data: { playerId: string, playerUsername: string }, setRoom: React.Dispatch<React.SetStateAction<Room | null>>) => {
	setRoom((prev) => {
		if (!prev) return prev;
		if (prev.players.map(players => players.id).includes(data.playerId)) return prev;

		const players = Array.isArray(prev.players) ? prev.players : [];
		if (players.map(players => players.id).includes(data.playerId)) return prev;

		return {
			...prev,
			players: [...prev.players, { id: data.playerId, username: data.playerUsername }],
		};
	});
};

const onPlayerQuit = (data: { playerId: string }, setRoom: React.Dispatch<React.SetStateAction<Room | null>>) => {
	setRoom((prev) => {
		if (!prev) return prev;

		return {
			...prev,
			players: prev.players.filter(players => players.id !== data.playerId)
		};
	});
};

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const socket = useSocket();
	const { user } = useAuth();

	const [room, setRoom] = useState<Room | null>(null);
	const [start, setStart] = useState<Boolean>(false);

	const joinMutation = useMutation({
		mutationFn: () => api.get("/room/me"),
		onSuccess: (data) => {
			setRoom(data.data);
		},
	});

	const newMutation = useMutation({
		mutationFn: () => api.post("/room/new"),
		onSuccess: (data) => {
			setRoom(data.data);
		}
	})

	const quitMutation = useMutation({
		mutationFn: () => api.post(`/room/${room?.roomId}/quit`),
		onSettled: () => {
			setRoom(null);
		},
	});

	const joinRoom = (newRoom?: Room) => {
		if (newRoom)
			setRoom(newRoom);
		else
			joinMutation.mutate();
	}

	const leaveRoom = () => {
		if (room?.roomId) {
			quitMutation.mutate();
		} else {
			setRoom(null);
		}
	}

	const newRoom = () => {
		newMutation.mutate();
	}

	const cancelStart = () => {
		setStart(false);
	}

	useEffect(() => {
		if (!socket) { leaveRoom(); return }

		joinRoom();

		socket.on('player_joined', (data) => onPlayerJoined(data, setRoom));
		socket.on('player_left', (data) => onPlayerQuit(data, setRoom));
		socket.on('launch', () => {
			setStart(true);
			navigate("/game");
		});

		return () => {
			socket.off('player_joined');
			socket.off('player_left');
			socket.off('launch');
			leaveRoom();
		};
	}, [socket]);

	if (joinMutation.isPending) return <p>Creating or joining room...</p>;

	if (joinMutation.isError) return (
		<p style={{ color: 'red' }}>
			An error occurred ({joinMutation.error.message}), please refresh.
		</p>
	);

	if (user && !room)
		return <div>Creating room</div>

	return (
		<RoomContext.Provider value={{ room, start, joinRoom, leaveRoom, newRoom, cancelStart }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoom = (): RoomContextValue | null => {
	return useContext(RoomContext);
};
