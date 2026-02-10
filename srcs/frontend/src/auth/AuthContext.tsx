import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import api, { setAccessToken, setOnLogout, setOnRefreshSuccess } from '../serverApi';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [token, setToken] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	const login = useCallback((userData: any, userToken: string) => {
		setUser(userData);
		setToken(userToken);
		setAccessToken(userToken);
		navigate("/home");
	}, [navigate]);

	const logout = useCallback(() => {
		setUser(null);
		setToken(null);
		setAccessToken(null);
		navigate("/");
	}, [navigate]);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['session'],
		queryFn: async () => await api.post('/auth/refresh'),
	});

	useEffect(() => {
		setOnLogout(logout);
		setOnRefreshSuccess((newToken) => setToken(newToken));

		return () => {
			setOnLogout(null as any);
			setOnRefreshSuccess(null as any);
		};
	}, [logout]);

	useEffect(() => {
		if (data) {
			setUser(data.data.user);
			setToken(data.data.token);
			setAccessToken(data.data.token);
		}
		if (!isLoading) {
			setIsInitializing(false);
		}
		if (isError) {
			navigate('/');
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

export const useAuth = () => useContext(AuthContext);