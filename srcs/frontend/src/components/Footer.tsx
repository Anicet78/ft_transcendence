import { Footer, Content } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';
import "./Footer.css"

const MyFooter = () => {
	return (
		<Footer className="my-footer">
			<Content textAlign="centered">
				<p>
				<strong>TransDungeon</strong> a transcendence project by{' '}
				<strong><a href="">agruet</a></strong>{', '}
				<strong><a href="">jumichel</a></strong>{', '}
				<strong><a href="">mprokosc</a></strong>{', '}
				<strong><a href="">ndabbous</a></strong>{', '}
				<strong><a href="">tpinton</a></strong>.
				</p>
			</Content>
			<Content textAlign="centered">
				<p>
					Find out about our{' '}
					<NavLink to="/privacy_policy" aria-label='Privacy Policy link'>
						<strong>Privacy Policy</strong>
					</NavLink>{' and '}
					<NavLink to="/terms_of_service" aria-label='Terms of Service link'>
						<strong>Terms of Service</strong>
					 </NavLink>.
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
