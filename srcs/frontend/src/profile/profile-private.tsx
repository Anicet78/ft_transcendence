import './profile.css'
import { Box } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts';
import skull from '../assets/skull.svg';
import { SidebarChat } from '../chat/components/SidebarChat.tsx';

type ProfileResponseType = GetResponse<"/profile", "get">;

const ProfilePrivate = () => {

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['profile', 'private'],
		queryFn: () => api.get("/profile"),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: ProfileResponseType = data.data;

	console.log(`https://${window.location.host}/uploads/${userData.avatarUrl}`);

	const username = userData.username;
	const avatar = userData.avatarUrl ? `https://${window.location.host}/uploads/${userData.avatarUrl}` : skull;
	const level = userData.gameProfile?.level || '0';
	const xp = userData.gameProfile?.totalXp || '0';
	const firstname = userData.firstName;
	const lastname = userData.lastName;
	const email = userData.mail;
	const password = '**********'
	const region = userData.region;
	const bestTime = userData.gameProfile?.bestTime || '0';
	const totalKills = userData.gameProfile?.totalEnemiesKilled || '0';
	const totalGames = userData.gameProfile?.totalGames || '0';
	const totalWins = userData.gameProfile?.totalWins || '0';
	const totalLoses = userData.gameProfile?.totalLoses || '0';

	return (
		<div className='profile-box'>
			<div className='box-head'>
				<div className='image-box'>
						<img aria-label='avatar of the user' src={avatar} crossOrigin="anonymous"/>
					<NavLink to='/profile/update/avatar' className='button is-small'>
						<span className="icon">
							<i className="fas fa-pen"></i>
						</span>
					</NavLink>
				</div>
				<div className='head-text'>
					<div className='profile_username'>
						{username}
						<NavLink to='/profile/update/username' className='button is-small'>
							<span className="icon">
								<i className="fas fa-pen"></i>
							</span>
						</NavLink>
					</div>
					<p>Lvl {level}</p>
					<p>{xp} XP</p>
				</div>
			</div>
			<div className='info'>
				<div className="info-column">
					<p><span className='category-name'>First name:</span>{firstname}</p>
					<p><span className='category-name'>Last name:</span>{lastname}</p>
					<p>
						<span className='category-name'>Email:</span>{email}
						<NavLink to='/profile/update/email' className='button is-small'>
							<span className="icon">
								<i className="fas fa-pen"></i>
							</span>
						</NavLink>
					</p>
					<p>
						<span className='category-name'>Password:</span>{password}
						<NavLink to='/profile/update/password' className='button is-small'>
							<span className="icon">
								<i className="fas fa-pen"></i>
							</span>
						</NavLink>
					</p>
					<p>
						<span className='category-name'>Region:</span>{region}
						<NavLink to='/profile/update/region' className='button is-small'>
								<span className="icon">
									<i className="fas fa-pen"></i>
								</span>
						</NavLink>
					</p>
				</div>
				 <div className="info-column">
					<p><span className='category-name'>Best time:</span>{bestTime}</p>
					<p><span className='category-name'>Total kills:</span>{totalKills}</p>
					<p><span className='category-name'>Total games:</span>{totalGames}</p>
					<p><span className='category-name'>Total wins:</span>{totalWins}</p>
					<p><span className='category-name'>Total loses:</span>{totalLoses}</p>
				</div>
			</div>
			<NavLink to="/friends/list" className="button is-large is-outlined navlink-button">Friends list</NavLink>
		</div>
	)
}

export default ProfilePrivate
