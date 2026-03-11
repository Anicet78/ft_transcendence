import { Footer, Content } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';
import parchmentCenter from "../assets/parchment-center.png"
import parchmentLeft from "../assets/parchment-left.svg"
import parchmentRight from "../assets/parchment-right.svg"

const MyFooter = () => {
	return (
		<Footer className="my-footer">
			<img src={parchmentLeft} />
			<div className='parchment-center'
				style={{
					backgroundImage: `url(${parchmentCenter})`,
					backgroundSize: 'contain',
					display: 'flex',
					alignItems: 'center'
				}}
			>
				<div className='parchment-text'>
					<Content textAlign="centered" style={{marginTop: 'auto'}}>
						<p>
						<span>DungeonNoDragon</span> a transcendence project by{' '}
						<span><a href="https://github.com/Anicet78">agruet</a></span>{', '}
						<span><a href="https://codeberg.org/jumichel">jumichel</a></span>{', '}
						<span><a href="https://github.com/mprokosch0">mprokosc</a></span>{', '}
						<span><a href="https://github.com/ndabboussi">ndabbous</a></span>{', '}
						<span><a href="https://github.com/Snak00s">tpinton</a></span>.
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
					<Content textAlign="centered" style={{marginBottom: 'auto'}}>
						<p>
							@2026 Piscine of July 2024 Team
						</p>
					</Content>
				</div>
			</div>
			<img src={parchmentRight} />
		</Footer>
	)
}

export default MyFooter
