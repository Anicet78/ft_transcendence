import axios from 'axios';
import { globalSocketId } from './socket/SocketContext';

let accessToken: string | null = null;
export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => accessToken = token;

let onLogoutCallback: (() => void) | null = null;

export const setOnLogout = (callback: () => void) => {
	onLogoutCallback = callback;
};

let onRefreshSuccessCallback: ((token: string) => void) | null = null;

export const setOnRefreshSuccess = (callback: (token: string) => void) => {
	onRefreshSuccessCallback = callback;
};

const waitForSocketId = (): Promise<string | null> => {
	return new Promise((resolve) => {
		let attempts = 0;
		const interval = setInterval(() => {
			if (globalSocketId) {
				clearInterval(interval);
				resolve(globalSocketId);
			}
			if (attempts > 20) {
				clearInterval(interval);
				resolve(null);
			}
			attempts++;
		}, 50);
	});
};

const api = axios.create({
	baseURL: (window.location.port == "5173" ? 'https://localhost:8443' : '') + `/api`,
	withCredentials: true,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
});

api.interceptors.request.use(
	async (config) => {
		const publicRoutes = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/42', '/auth/google', '/'];
		if (config.url && !publicRoutes.includes(config.url) && accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
			config.headers['x-socket-id'] = await waitForSocketId();
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => { return response },
	async (error) => {
		const originalRequest = error.config;

		const isRefreshRequest = originalRequest.url.includes('/auth/refresh');
		const isLogoutRequest = originalRequest.url.includes('/auth/logout');

		if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshRequest && !isLogoutRequest) {
			originalRequest._retry = true;

			try {
				const res = await axios.post(`${window.location.port == "5173" ? 'https://localhost:8443' : ''}/api/auth/refresh`, {}, { withCredentials: true });

				accessToken = res.data.token;
				if (onRefreshSuccessCallback) onRefreshSuccessCallback(accessToken!);
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

				return api(originalRequest);
			} catch (refreshError) {
				if (onLogoutCallback) onLogoutCallback();
				return Promise.reject(refreshError);
			}
		}

		const errorMessage = error.response?.data?.message ?? error.response?.data?.error;
		return Promise.reject(new Error(errorMessage));
	}
);

export default api;
