import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerUrl } from '../serverApi';
import { useAuth } from '../auth/AuthContext';

export let globalSocketId: string | null = null;

const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { token } = useAuth();

	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!token) {
			setSocket(null);
			globalSocketId = null;
			return;
		}

		const newSocket = io(ServerUrl, {
			path: "/api/socket.io/",
			auth: { token }
		});

		setSocket(newSocket);

		newSocket.on("connect", () => {
			globalSocketId = newSocket.id ?? null;
		});

		newSocket.on("disconnect", () => {
			globalSocketId = null;
		});


		return () => {
			newSocket.off("connect");
			newSocket.off("disconnect");
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

export const useSocket = () => useContext(SocketContext);