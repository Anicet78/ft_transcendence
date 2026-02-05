import { io, Socket } from 'socket.io-client';
import { ServerUrl } from './serverApi';

export const SocketClient = {
	socket: null as Socket | null,

	connect() {
		this.socket = io(ServerUrl, { path: "/api/socket.io/" });
	},

	disconnect() {
		this.socket?.disconnect()
	},

	getSocket() {
		return this.socket
	},

	getSocketId() {
		return this.socket?.id || null
	}
}
