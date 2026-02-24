// sert a faire le rendu de la page (details dans App.tsx)
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'bulma/css/bulma.min.css'; // bulma style css
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
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
import JoinRoom from './home/join-room.tsx';
import Game from './game/game.tsx';
import FriendRequest from './friendship/FriendRequests.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { SocketProvider } from './socket/SocketContext.tsx';
import { RoomProvider } from './home/RoomContext.tsx';
import ProfileUpdate from './profile/ProfileUpdate.tsx';
import { Toaster } from "sonner";
import { ChatProvider } from './chat/ChatContext.tsx';
import GroupChatCreation from './chat/components/GroupChatCreation.tsx';
import GroupChatInvitations from './chat/components/GroupChatInvitations.tsx';
import CallbackGoogle from './auth/callbackGoogle.tsx';
import Callback42 from './auth/callback42.tsx';
import { InviteToGroupChat } from './chat/components/InviteToGroupChat.tsx';
import SearchPage from './search/SearchPage.tsx';

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
			<Banner />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/callbackGoogle" element={<CallbackGoogle />} />
				<Route path="/callback42" element={<Callback42 />} />

				<Route path="/home" element={<Home />} />
				<Route path="/join/:roomId" element={<JoinRoom />} />
				<Route path="/game" element={<Game />} />
				<Route path="/search" element={<SearchPage />} />

				<Route path="/friends/list" element={<FriendList />} />
				<Route path="/friends/requests/" element={<FriendRequest />} />

				<Route path="/group/:chatId/invite/:friendId" element={<InviteToGroupChat />} />
				<Route path="/group/invitations" element={<GroupChatInvitations />} />

				<Route path="/chat/:chatId/info" element={<ChatView />} />
				<Route path="/chat/list" element={<ChatList />} />
				<Route path="/chat/group/new" element={<GroupChatCreation />} />

				<Route path="/profile" element={<ProfilePrivate />} />
				<Route path="/profile/update/:field" element={<ProfileUpdate />} />
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
				<Toaster />
				<AuthProvider>
					<SocketProvider>
						<ChatProvider>
							<RoomProvider>
								<AppEntryPoint />
							</RoomProvider>
						</ChatProvider>
					</SocketProvider>
				</AuthProvider>
			</Router>
		<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	// </StrictMode>,
)
