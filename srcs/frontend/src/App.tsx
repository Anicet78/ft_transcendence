import './App.css'
import { Box } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';
// import ChatList from './chat/ChatList';
// import Chatview from './chat/ChatView';

const App = () => {
	return (
		// <>
			<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' textSize='2' textWeight='bold'>
				<div>Welcome to the game Dungeon</div>
				<br/>
				<div>
					<NavLink to="/login" className="button is-dark is-medium is-outlined">Sign in</NavLink>
					<NavLink to="/register" className="button is-dark is-medium is-outlined">Sign up</NavLink>
				</div>
			</Box>

		// 	<Routes>
		// 		<Route path="/chat" element={<ChatList />} />
		// 		<Route path="/chat/:chatId" element={<Chatview />} />
		// 	</Routes>
		// </>
	)
}

export default App
