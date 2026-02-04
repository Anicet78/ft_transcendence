import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import './game.css'
import Banner from '../components/Banner.tsx';
import MyFooter from '../components/Footer.tsx';
import { Box } from '@allxsmith/bestax-bulma';

const Game = () => {
	return (
		<>
			<h1><Banner /></h1>
			<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<div>Game box</div>
			</Box>
			<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<div>Chat box</div>
			</Box>
			<MyFooter />
		</>
	)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Game />
  </StrictMode>,
)