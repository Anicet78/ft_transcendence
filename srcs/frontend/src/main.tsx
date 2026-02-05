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

const queryClient = new QueryClient();

// va chercher l'element avec l'ID 'root' dans le doc index.html et met App dedans
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router>
				<h1><Banner /></h1>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/login" element={<Login />} />
					{/* <Route path="/me" element={} />
					<Route path="/offline" element={} />
					<Route path="/refresh" element={} /> */}
					<Route path="/register" element={<Register />} />
					{/* <Route path="/chat/:chatId" element={} />
					<Route path="/chat/:chatId/messages" element={} />
					<Route path="/chat/:chatId/message/:messageId/edit" element={} />
					<Route path="/chat/:chatId/message/:messageId/moderate" element={} />
					<Route path="/chat/:chatId/message/:messageId/restore" element={} />
					<Route path="/chat/:messageId" element={} />
					<Route path="/chat/:chatId/info" element={} />
					<Route path="/chat/list" element={} /> */}
					<Route path="/friends" element={<FriendList />} />
					{/* <Route path="/friends/requests" element={} /> */}
					{/* <Route path="/friends/:id" element={<ProfilePublic />} /> */}
					{/* <Route path="/group/:chatId/role/:memberId" element={} />
					<Route path="/group/:chatId/kick/:memberId" element={} />
					<Route path="/group/:chatId/ban/:memberId" element={} />
					<Route path="/group/:chatId/unban/:memberId" element={} />
					<Route path="/group/:chatId/bans" element={} /> */}
					{/* <Route path="/chat/group/new" element={} />
					<Route path="/group/:chatId/disband" element={} />
					<Route path="/group/:chatId/quit" element={} /> */}
					{/* <Route path="/group/:chatId/:memberId/invite" element={} />
					<Route path="/group/invitations" element={} />
					<Route path="/group/:chatInvitationId" element={} /> */}
					<Route path="/profile" element={<ProfilePrivate />} />
					<Route path="/profile/:id" element={<ProfilePublic />} />
					{/* <Route path="/profile/:id/block" element={} />
					<Route path="/profile/:id/unblock" element={} /> */}
					{/* <Route path="/:id" element={} />
					<Route path="/new" element={} />
					<Route path="/:id/join" element={} />
					<Route path="/:id/host" element={} />
					<Route path="/:id/kick" element={} />
					<Route path="/verify" element={} /> */}
					<Route path="/terms_of_service" element={<TermsService />} />
					<Route path="/privacy_policy" element={<Privacy />} />
					<Route path="*" element={<Error />} />
				</Routes>
				<MyFooter />
			</Router>
		<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
)
