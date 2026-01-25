// import { useState } from 'react'
import { Button, Icon, IconText, Dropdown } from '@allxsmith/bestax-bulma';
import '../styles/Banner.css'

const Logo = () => {
	return(
		<Button color="primary" isOutlined display="flex" justifyContent="center" alignItems="center">
		<IconText
		iconProps={{
			name: 'dragon',
			ariaLabel: 'Home',
			textColor: 'primary',
		}}
		>
		TransDungeon
		</IconText>
		</Button>
	)
}

const Menu = () => {
	return (
		<div>
		<Button color="primary" isOutlined>
			<Icon
			name="bars"
			color="primary"
			ariaLabel="Menu"
			>
			</Icon>
		</Button>
		<Dropdown label="Menu">
			<Dropdown.Item>Language</Dropdown.Item>
			<Dropdown.Item>Light/Dark Mode</Dropdown.Item>
			<Dropdown.Divider />
			<Dropdown.Item>About the game</Dropdown.Item>
			<Dropdown.Item>Credentials</Dropdown.Item>
		</Dropdown>
		</div>
	)
}

const Banner = () => {
	return (
	<div className='banner'>
		<Logo />
		<Menu />
	</div>)
}

export default Banner
