import { Footer, Content } from '@allxsmith/bestax-bulma';

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
					<a href="../policies/privacy-policy.html" aria-label='Privacy Policy link'>Privacy Policy</a>{' and '}
					<a href="../policies/terms-of-service.html" aria-label='Terms of Service link'>Terms of Service</a>.
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