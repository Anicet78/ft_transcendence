import { useState } from "react";
import { NavLink } from "react-router";

export const PlayerDropdown = ({ player, kickFn, hostFn, isHost, isSelf }) => {

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div key={player.username}>
			<p onClick={() => setIsOpen(!isOpen)}>
				{player.username}
			</p>

			{isOpen && (
				<div>
					<ul>
						<NavLink to={`/profile/${player.username}`} className='button is-dark is-small is-outlined' aria-label='spectate button'>See Profil</NavLink>
						{/* <li onClick={() => console.log("Message à", player.username)}>Message</li> */}
						{isHost && !isSelf &&
							<>
								<li className='button is-dark is-small is-outlined' aria-label='spectate button' onClick={() => kickFn(player.id)}>Kick player</li>
								<li className='button is-dark is-small is-outlined' aria-label='spectate button' onClick={() => hostFn(player.id)}>Set as host</li>
							</>
						}
					</ul>
				</div>
			)}
		</div>
	);
};