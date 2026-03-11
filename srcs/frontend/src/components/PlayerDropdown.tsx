import { Button } from "@allxsmith/bestax-bulma";
import { useState } from "react";
import { NavLink } from "react-router";

export const PlayerDropdown = ({ player, kickFn, hostFn, isHost, isSelf }) => {

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div key={player.username} className="player-card" onClick={() => setIsOpen(!isOpen)}>
			<p>
				{player.username}
			</p>

			{isOpen && (
				<div className="player-buttons">
					<NavLink to={`/profile/${player.username}`} className='button is-small player-button' aria-label='profile button'>See Profil</NavLink>
					{isHost && !isSelf &&
						<>
							<Button className='button is-small kick-button' aria-label='kick button' onClick={() => kickFn(player.id)}>Kick player</Button>
							<Button className='button is-small host-button' aria-label='set host button' onClick={() => hostFn(player.id)}>Set as host</Button>
						</>
					}
				</div>
			)}
		</div>
	);
};
