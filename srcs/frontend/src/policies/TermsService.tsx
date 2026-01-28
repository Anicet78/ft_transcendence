import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css'
import '../index.css'
import Banner from '../components/Banner.tsx';
import MyFooter from '../components/Footer.tsx';
import { Box } from '@allxsmith/bestax-bulma';

const TermsService = () => {
	return (
		<>
			<h1><Banner /></h1>
			<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<h2>Terms of Service</h2>
			</Box>
			<MyFooter />
		</>
	)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<TermsService />
  </StrictMode>,
)
