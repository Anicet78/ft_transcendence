import { useState } from 'react'
import { NavLink } from 'react-router';
import { Navbar, Icon } from '@allxsmith/bestax-bulma';
import './Banner.css'
import SearchBar from '../search/SearchBar.tsx';
import { useAuth } from '../auth/AuthContext.tsx';

const Banner = () => {
	const { user, logout } = useAuth()
	const [active, setActive] = useState(false)
	const username = user?.username
	let logo_path = user ? '/home' : '/';
	let button_path = user ? '/profile' : '/';

	const handleClick = () => {
		logout()
	}

	return (
		<Navbar color='dark' role='navigation' aria-label='main navigation' className="navbar-full">
				<Navbar.Brand>
					<NavLink to={logo_path} aria-label='home button' className='button is-primary is-outlined is-centered'>
						<Icon
						name="dragon"
						ariaLabel="dragon logo"
						/>
						<span>TransDungeon</span>
					</NavLink>
					<Navbar.Burger
						active={active}
						onClick={() => setActive(!active)}
						aria-label="menu"
						aria-expanded={active}
						data-target="navbarMenu"
					/>
				</Navbar.Brand>
				<Navbar.Menu id="navbarMenu" active={active}>
					<Navbar.Start>
						{user && (<Navbar.Item><SearchBar /></Navbar.Item>)}
					</Navbar.Start>
					<Navbar.End>
						{user &&
							<NavLink to={button_path} aria-label='profile button' className='button is-primary is-medium is-centered'>
								<Icon name='user' ariaLabel='user icon' />
								<span>{username}</span>
							</NavLink>
						}
						<Navbar.Dropdown hoverable right  className="profile-dropdown">
							<Navbar.Item as="a" textColor='primary'>
								<Icon name="bars" ariaLabel="Menu" />
								<span>Menu</span>
							</Navbar.Item>
							<Navbar.DropdownMenu>
								<Navbar.Item onClick={handleClick} className="dropdown-content">Logout</Navbar.Item>
								<Navbar.Divider />
								<Navbar.Item>
									<NavLink to="/about" className="dropdown-content">About the game</NavLink>
								</Navbar.Item>
							</Navbar.DropdownMenu>
						</Navbar.Dropdown>
					</Navbar.End>
				</Navbar.Menu>
		</Navbar>
	)
}

export default Banner
