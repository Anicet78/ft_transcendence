// sert a faire le rendu de la page (details dans App.tsx)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'bulma/css/bulma.min.css'; // bulma style css
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import './App.css'
import App from './App.tsx'
import Login from './auth/login.tsx';
import Register from './auth/register.tsx';
import ProfilePrivate from './profile/profile-private.tsx';
import ProfilePublic from './profile/profile-public.tsx';
import TermsService from './policies/TermsService.tsx';
import Privacy from './policies/PrivacyPolicy.tsx';
import Error from './error/error.tsx';
import Banner from './components/Banner.tsx';
import MyFooter from './components/Footer.tsx';
import FriendList from './friendship/FriendsList.tsx';
import ChatList from './chat/ChatList.tsx';
import ChatView from './chat/ChatView.tsx';
import Home from './home/home.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { SocketProvider } from './socket/SocketContext.tsx';
import FriendRequest from './friendship/FriendRequests.tsx';
import UpdateRequest from './friendship/UpdateRequest.tsx';
import RemoveFriend from './friendship/RemoveFriend.tsx';
import AddFriend from './friendship/AddFriend.tsx';
import SearchResult from './search/SearchResult.tsx';
import SearchComponent from './search/searchComponent.tsx';
import UsernameUpdate from './profile/UsernameUpdate.tsx';
import AvatarUpdate from './profile/AvatarUpdate.tsx';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

const AppEntryPoint = () => {
	return (
		<>
			<h1><Banner /></h1>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/test" element={<SearchComponent />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/home" element={<Home />} />
				<Route path="/friends" element={<FriendList />} />
				<Route path="/friends/requests/" element={<FriendRequest />} />
				<Route path="/friends/requests/update/:id" element={<UpdateRequest />} />
				<Route path="/friends/remove/:id" element={<RemoveFriend />} />
				<Route path="/friends/add/:id" element={<AddFriend />} />
				<Route path="/chat/:chatId/info" element={<ChatView />} />
				<Route path="/chat/list" element={<ChatList />} />
				<Route path="/profile" element={<ProfilePrivate />} />
				<Route path="/profile/updateUsername" element={<UsernameUpdate />} />
				<Route path="/profile/updateAvatar" element={<AvatarUpdate />} />
				<Route path="/profile/:username" element={<ProfilePublic />} />
				<Route path="/terms_of_service" element={<TermsService />} />
				<Route path="/privacy_policy" element={<Privacy />} />
				<Route path="*" element={<Error />} />
			</Routes>
			<MyFooter />
		</>
	);
};

createRoot(document.getElementById('root') as HTMLElement).render(
	// <StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router>
				<AuthProvider>
					<SocketProvider>
						<AppEntryPoint />
					</SocketProvider>
				</AuthProvider>
			</Router>
		<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	// </StrictMode>,
)
