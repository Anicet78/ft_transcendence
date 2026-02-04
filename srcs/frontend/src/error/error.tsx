import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css'
import '../index.css'

import { Box } from '@allxsmith/bestax-bulma';

const Error = () => {
	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
			<h1>This page doesn't exist</h1>
		</Box>
	)
}

export default Error