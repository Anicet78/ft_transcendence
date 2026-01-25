import { FunctionalComponent } from 'react'
import { Button, IconText } from '@allxsmith/bestax-bulma'; // quand on exporte pas en default mettre des accolades

interface NavbarProps {
	token: string | undefined
}

// pour gerer la verification du status de connexion du user -> useEffect a regarder et observer pattern (subscription to change, emission of signal)
export const Navbar: FunctionalComponent<NavbarProps> = (props) => {
	console.log("token is", props.token);
	return (
		<div>
		<Button color="primary" isOutlined display="flex" justifyContent="center" alignItems="center">
		<IconText
		iconProps={{
			name: 'dragon',
			ariaLabel: 'Check icon',
			textColor: 'white',
		}}
		>
		TransDungeon
		</IconText>
		</Button>
		{
			props.token && (
				<p>User logged in</p>
			)
		}
		</div>
	)
}
