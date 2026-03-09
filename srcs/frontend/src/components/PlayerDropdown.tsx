import { useState } from "react";
import { NavLink } from "react-router";

export const PlayerDropdown = ({ player, kickFn, hostFn, isHost, isSelf }) => {

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div key={player.username} className="player-card">
			<p onClick={() => setIsOpen(!isOpen)}>
				{player.username}
			</p>

			{isOpen && (
				<div className="player-buttons">
					<ul>
						<NavLink to={`/profile/${player.username}`} className='button is-small is-outlined player-button' aria-label='profile button'>See Profil</NavLink>
						{/* <li onClick={() => console.log("Message à", player.username)}>Message</li> */}
						{isHost && !isSelf &&
							<>
								<li className='button is-small is-outlined kick-button' aria-label='kick button' onClick={() => kickFn(player.id)}>Kick player</li>
								<li className='button is-small is-outlined host-button' aria-label='set host button' onClick={() => hostFn(player.id)}>Set as host</li>
							</>
						}
					</ul>
				</div>
			)}
		</div>
	);
};
