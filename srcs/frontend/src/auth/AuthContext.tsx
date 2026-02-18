import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import api, { setAccessToken, setOnLogout, setOnRefreshSuccess } from '../serverApi';
import { useQuery } from '@tanstack/react-query';
import type { GetResponse } from '../types/GetType';
import toast from '../Notifications';

export type User = GetResponse<"/auth/refresh", "post">["user"];

export type AuthContextValue = {
	user: User | null;
	token: string | null;
	login: (userData: User, userToken: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState< User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	const login = useCallback((userData: User, userToken: string) => {
		setUser(userData);
		setToken(userToken);
		setAccessToken(userToken);
		navigate("/home");
	}, [navigate]);

	const logout = useCallback(async () => {
		try {
			await api.post('/auth/logout');
		} catch (err) {
			console.error('Logout request failed', err);
		} finally {
			setUser(null);
			setToken(null);
			setAccessToken(null);
			navigate("/");
		}
	}, [navigate]);

	// Hooks for API refresh / logout
	useEffect(() => {
		setOnLogout(logout);
		setOnRefreshSuccess((newToken) => setToken(newToken));

		return () => {
			setOnLogout(null as any);
			setOnRefreshSuccess(null as any);
		};
	}, [logout]);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['session'],
		queryFn: async () => await api.post('/auth/refresh'),
		refetchOnWindowFocus: false,
		retry: false
	});

	useEffect(() => {
		if (data?.data?.user && data.data.token) {
			setUser(data.data.user);
			setToken(data.data.token);
			setAccessToken(data.data.token);
			toast({ title: `Welcome ${data.data.user.username}` });
		}
		if (!isLoading) {
			setIsInitializing(false);
		}
		if (isError) {
			setUser(null);
			setToken(null);
			setAccessToken(null);
		}

		return () => {
			setIsInitializing(false);
			setUser(null);
			setToken(null);
		}
	}, [data, isLoading, isError]);

	if (isInitializing)
		return <div>Loading session...</div>;

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextValue => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
};
