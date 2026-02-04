// sert a faire le rendu de la page (details dans App.tsx)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router";
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

// va chercher l'element avec l'ID 'root' dans le doc index.html et met App dedans
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Router>
			<h1><Banner /></h1>
			<Routes>
			<Route path="/" element={<App />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/profile/" element={<ProfilePrivate />} />
			<Route path="/profile/:id" element={<ProfilePublic />} />
			<Route path="/friends/" element={<ProfilePublic />} />
			<Route path="/terms_of_service" element={<TermsService />} />
			<Route path="/privacy_policy" element={<Privacy />} />
			<Route path="*" element={<Error />} />
			{/* <Route path="/profile" element={<Profile />} /> */}
			</Routes>
			<MyFooter />
		</Router>
	</StrictMode>,
)
