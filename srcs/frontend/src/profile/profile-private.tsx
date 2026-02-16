import '../App.css'
import './profile.css'
import { Box } from '@allxsmith/bestax-bulma';
import { NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts';

type ProfileResponseType = GetResponse<"/profile", "get">;

const ProfilePrivate = () => {

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['profile', 'private'],
		queryFn: () => api.get("/profile"),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: ProfileResponseType = data.data;

	const username = userData.username;
	const avatar = userData.avatarUrl ? `http://localhost:3000/uploads/${userData.avatarUrl}` : '../assets/skull.svg';
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
	console.log("in front end: " + userData.avatarUrl);

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			<h1>Welcome to your profile page</h1>
			<br/>
			<Box className='box-head' bgColor="white" justifyContent='center' textSize='4'>
				<Box bgColor='white' className='image-box'>
					<figure className='image is-128x128'>
						<img aria-label='avatar of the user' src={avatar} crossOrigin="anonymous"/>
					</figure>
					<NavLink to='/profile/update/avatar' className='button is-small is-white'>
						<span className="icon">
							<i className="fas fa-pen"></i>
						</span>
					</NavLink>
				</Box>
				<Box className='head-text'>
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
				</Box>
			</Box>
			<Box className='info' bgColor="white" textSize='5'>
				<p>First name: {firstname}</p>
				<p>Last name: {lastname}</p>
				<p>Email: {email}</p>
				<p>
					Password: {password}
					{/* <NavLink to='/profile/update/' className='button is-small is-white'>
							<span className="icon">
								<i className="fas fa-pen"></i>
							</span>
					</NavLink> */}
				</p>
				<p>
					Region: {region}
					<NavLink to='/profile/update/region' className='button is-small is-white'>
							<span className="icon">
								<i className="fas fa-pen"></i>
							</span>
					</NavLink>
				</p>
				<p>Best time: {bestTime}</p>
				<p>Total ennemies killed: {totalKills}</p>
				<p>Total games: {totalGames}</p>
				<p>Total wins: {totalWins}</p>
				<p>Total loses: {totalLoses}</p>
			</Box>
			<NavLink to="/friends" className="button is-large">Friends list</NavLink>
			<NavLink
				to="/chat/list"
				className="button is-dark is-medium is-outlined mt-4"
			>
				View my chats
			</NavLink>
		</Box>
	)
}

export default ProfilePrivate