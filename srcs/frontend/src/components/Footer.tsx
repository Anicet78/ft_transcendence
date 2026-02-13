import { Footer, Content } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';

const MyFooter = () => {
	return (
		<Footer>
			<Content textAlign="centered">
				<p>
				<strong>TransDungeon</strong> a transcendence project by{' '}
				<a href="">agruet</a>{', '}
				<a href="">jumichel</a>{', '}
				<a href="">mprokosc</a>{', '}
				<a href="">ndabbous</a>{', '}
				<a href="">tpinton</a>.
				</p>
			</Content>
			<Content textAlign="centered">
				<p>
					Find out about our{' '}
					<NavLink to="/privacy_policy" aria-label='Privacy Policy link'>Privacy Policy</NavLink>{' and '}
					<NavLink to="/terms_of_service" aria-label='Terms of Service link'>Terms of Service</NavLink>.
				</p>
			</Content>
			<Content textAlign="centered">
				<p>
					@2026 Piscine of July 2024 Team
				</p>
			</Content>
		</Footer>
	)
}

export default MyFooter