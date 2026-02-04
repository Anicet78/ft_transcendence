import { useState } from 'react'
import { NavLink } from 'react-router';
import { Navbar, Icon } from '@allxsmith/bestax-bulma';
import '../styles/Banner.css'

const Banner = () => {
	const [active, setActive] = useState(false);
	return (
		<Navbar color='dark' aria-label='navigation bar'>
			<Navbar.Brand>
				<NavLink to="/" aria-label='home button' className='button is-large is-primary is-outlined is-centered'>
					<Icon
					name="dragon"
					ariaLabel="dragon logo"
					/>
					<span>TransDungeon</span>
				</NavLink>
				<Navbar.Burger
				active={active}
				onClick={() => setActive(a => !a)}
				aria-label="menu"
				aria-expanded={active}
				/>
			</Navbar.Brand>
			<Navbar.Menu active={active}>
				<Navbar.Start>
				</Navbar.Start>
				<Navbar.End>
					<Navbar.Dropdown hoverable>
						<Navbar.Item as="a" textColor='primary'>
						<Icon
						name="bars"
						ariaLabel="Menu"
						/>
						<span>Menu</span>
						</Navbar.Item>
						<Navbar.DropdownMenu>
							<Navbar.Item href="#">Language</Navbar.Item>
							<Navbar.Item href="#">Dark mode</Navbar.Item>
							<Navbar.Divider />
							<Navbar.Item href="#">About the game</Navbar.Item>
							<Navbar.Item href="#">Credentials</Navbar.Item>
						</Navbar.DropdownMenu>
					</Navbar.Dropdown>
				</Navbar.End>
			</Navbar.Menu>
		</Navbar>
	)
}

export default Banner
