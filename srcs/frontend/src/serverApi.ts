import axios from 'axios';
import { SocketClient } from './socket';

export const ServerUrl= "https://localhost:8443"

let accessToken: string | null = null;
export const getAccessToken = () => accessToken;

const api = axios.create({
	baseURL: `${ServerUrl}/api`,
	withCredentials: true,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
});

api.interceptors.request.use(
	(config) => {
		const publicRoutes = ['/auth/login', '/auth/register', '/auth/refresh', '/'];
		if ((!config.url || !publicRoutes.includes(config.url)) && accessToken)
			config.headers.Authorization = `Bearer ${accessToken}`;

		const socketRoutes = ['/room/new', '/room/:id/join', '/room/:id/kick'];
		if ((!config.url || !socketRoutes.includes(config.url)) && SocketClient.getSocketId())
			config.headers['x-socket-id'] = SocketClient.getSocketId();

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		if (response.data.token)
			accessToken = response.data.token;
		return response;
	}, async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const res = await axios.post('/auth/refresh', {});
				accessToken = res.data.accessToken;
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

				return api(originalRequest);
			} catch {
				SocketClient.disconnect();
				// Use the router to go to the home page
			}
		}

		error.message ??= error.error;

		return Promise.reject(error);
	}
);

export default api;
