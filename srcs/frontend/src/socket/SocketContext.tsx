import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../auth/AuthContext';
import toast from '../Notifications';

export let globalSocketId: string | null = null;

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { token } = useAuth();

	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!token) {
			setSocket(null);
			globalSocketId = null;
			return;
		}

		const newSocket = io(`${window.location.port == "5173" ? 'https://localhost:8443' : ''}`, {
			path: '/api/socket.io/',
			auth: { token }
		});

		setSocket(newSocket);

		newSocket.on("connect", () => {
			globalSocketId = newSocket.id ?? null;
		});

		newSocket.on("disconnect", () => {
			globalSocketId = null;
		});

		newSocket.on("friendship_notification", (payload) => {
			const messages: Record<string, string> = {
				add: `${payload.fromUsername} sent you a friend request`,
				accept: `${payload.fromUsername} accepted your friend request`,
				reject: `${payload.fromUsername} rejected your friend request`,
				cancel: `${payload.fromUsername} cancelled the friend request`,
				remove: `${payload.fromUsername} removed you from friends`,
			};

			toast({
				title: "Friendship update",
				message: messages[payload.action] ?? "Friendship updated",
				type: "is-info",
			});
		});

		return () => {
			newSocket.off("connect");
			newSocket.off("disconnect");
			newSocket.off("friendship_notification");
			newSocket.close();
			setSocket(null);
			globalSocketId = null;
		};
	}, [token]);

	return (
		<SocketContext.Provider value={ socket }>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = (): Socket | null => {
	return useContext(SocketContext);
};
