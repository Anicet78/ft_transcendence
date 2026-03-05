import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router';
import { Navbar, Icon } from '@allxsmith/bestax-bulma';
import SearchBar from '../search/SearchBar.tsx';
import { useAuth } from '../auth/AuthContext.tsx';

const Banner = () => {
	const { user, logout } = useAuth()
	const [active, setActive] = useState(false)
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const dropdownRef = useRef(null); // Reference to the dropdown menu
	const username = user?.username
	let logo_path = user ? '/home' : '/';
	let button_path = user ? '/profile' : '/';

	const handleClick = (event: React.MouseEvent) => {
		event.stopPropagation(); // Prevent any other click events from being triggered
		logout()
	}

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility
	};

	// Close the dropdown if the user clicks outside of it
	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setDropdownVisible(false); // Close dropdown if clicked outside
		}
		};

		// Add event listener for clicks outside of the dropdown
		document.addEventListener('click', handleOutsideClick);

		// Cleanup event listener on component unmount
		return () => {
		document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	return (
		<Navbar color='dark' role='navigation' aria-label='main navigation' className="navbar-full">
				<Navbar.Brand>
					<NavLink to={logo_path} aria-label='home button' className='button is-primary is-outlined is-centered' style={{fontFamily: 'Serif'}}>
						<Icon
							name="dragon"
							ariaLabel="dragon logo"
						/>
						<span>DungeonNoDragon</span>
					</NavLink>
					<Navbar.Burger
						active={active}
						onClick={() => setActive(!active)}
						aria-label="menu"
						aria-expanded={active}
						data-target="navbarMenu"
						color='primary'
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
						<Navbar.Dropdown hoverable right className="profile-dropdown">
							<Navbar.Item 
								as="button"
								className="button is-primary is-medium is-centered"
								textColor="black"
								onClick={toggleDropdown}
							>
								<Icon name="bars" ariaLabel="Menu" />
								<span>Menu</span>
							</Navbar.Item>
							<Navbar.DropdownMenu className={`${dropdownVisible ? 'is-active' : ''} dropdown-full`}>
								{user && <Navbar.Item onClick={handleClick} className="dropdown-content">Logout</Navbar.Item>}
								{user && <Navbar.Divider className='dropdown-divider'/>}
								<NavLink to="/about" className="navbar-item dropdown-content">About the game</NavLink>
							</Navbar.DropdownMenu>
						</Navbar.Dropdown>
					</Navbar.End>
				</Navbar.Menu>
		</Navbar>
	)
}

export default Banner
