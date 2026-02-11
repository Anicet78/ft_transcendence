import { useState } from 'react'
import { NavLink } from 'react-router';
import { Navbar, Icon } from '@allxsmith/bestax-bulma';
import '../styles/Banner.css'
import SearchBar from './SearchBar.tsx';
import { useAuth } from '../auth/AuthContext.tsx';

const Banner = () => {
	const { user } = useAuth()
	const [active, setActive] = useState(true)
	const connected = false
	const username = user?.role || 'My username'
	let path = "/"

	if (username !== 'My username') {path = "/home"}
	return (
		<Navbar color='dark' role='navigation' aria-label='main navigation'>
			<Navbar.Brand>
			
					<NavLink to={path} aria-label='home button' className='button is-large is-primary is-outlined is-centered'>
						<Icon
						name="dragon"
						ariaLabel="dragon logo"
						/>
						<span>TransDungeon</span>
					</NavLink>

			</Navbar.Brand>
			<Navbar.Menu active={active}>
				<Navbar.Start>
					<Navbar.Item hidden={!connected}>
						<SearchBar />
					</Navbar.Item>
				</Navbar.Start>
				<Navbar.End>
						<NavLink to='/profile' aria-label='profile button' className='button is-primary is-medium is-centered'>
							<Icon name='user' ariaLabel='user icon'/>
							<span>{username}</span>
						</NavLink>
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
