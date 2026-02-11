import { useQuery } from '@tanstack/react-query';
import '../App.css'
import './profile.css'
import { Box, Button } from '@allxsmith/bestax-bulma';
import { useNavigate, useParams } from 'react-router';
import type { GetResponse } from '../types/GetType';
import api from '../serverApi';
import { NavLink } from 'react-router';

type ProfileResponseType = GetResponse<"/profile/{username}", "get">;
// type FriendshipResponseType = GetResponse<"/friends/status/{id}", "get">;

const ProfilePublic = () => {
	const navigate = useNavigate()
	const username = useParams().username;

	const userQuery = useQuery({
		queryKey: ['profile', username],
		queryFn: () => api.get(`/profile/${username}`),
	});

	const friendshipQuery = useQuery({
		queryKey: ['friendship', username],
		queryFn: () => api.get(`/friends/status/${userQuery.data?.data.appUserId}`),
		enabled: !!userQuery.data?.data.appUserId,
	});

	if (userQuery.isLoading) return <p>Chargement...</p>;
	if (userQuery.isError || !userQuery.data) return <div>Erreur: {userQuery.error?.message || 'unknown'}</div>;

	const userData: ProfileResponseType = userQuery.data.data;
	const friendshipData: any = friendshipQuery.data?.data;

	const avatar = userData.avatarUrl || '../assets/skull.svg';
	const level = userData.gameProfile?.level || '0';
	const xp = userData.gameProfile?.totalXp || '0';
	const isConnected = userData.availability || false;
	const isPlaying = userData.playing || false;
	const friendshipStatus = friendshipQuery.isSuccess ? friendshipData.status : 'unknown';
	const bestTime = userData.gameProfile?.bestTime || '0';
	const totalKills = userData.gameProfile?.totalEnemiesKilled || '0';
	const totalGames = userData.gameProfile?.totalGames || '0';
	const totalWins = userData.gameProfile?.totalWins || '0';
	const totalLoses = userData.gameProfile?.totalLoses || '0';

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			<h1>Welcome to {username} profile page</h1>
			<br/>
			<Box className='box-head' bgColor="white" justifyContent='center' textSize='4'>
				<Box bgColor='white' className='image-box'>
					<figure className='image is-128x128'>
						<img aria-label='avatar of the user' src={avatar} />
					</figure>
				</Box>
				<Box className='head-text'>
					<p>{username}</p>
					<p>Status: {isPlaying ? 'playing' : isConnected ? 'online' : 'offline'}</p>
					<p>Lvl {level}</p>
					<p>{xp} XP</p>
				</Box>
			</Box>
			<Box className='info' bgColor="white" textSize='5'>
				<p>Best time: {bestTime}</p>
				<p>Total ennemies killed: {totalKills}</p>
				<p>Total games: {totalGames}</p>
				<p>Total wins: {totalWins}</p>
				<p>Total loses: {totalLoses}</p>
			</Box>
			{friendshipStatus !== 'self' &&
				<>
					<div>
						{(friendshipStatus === 'sent') && 
						<Button color="dark" disabled size='large'>
							Request pending
						</Button>}
						{friendshipStatus === 'friends' &&
						<div>
							<NavLink to={"/friends/remove/" + userData.appUserId}>Remove friend</NavLink>
							<br />
							<Button color='primary' isInverted aria-label='join button' size='medium'>Join / decline</Button>
							<br />
							<Button color='primary' isInverted aria-label='spectate button' size='medium'>Spectate</Button>
						</div>}
						{friendshipStatus === 'received' && 
						<div>
							<NavLink to={"/friends/requests/update/" + friendshipId} state={{requestedAction: "accept"}}>Accept request</NavLink>
							<NavLink to={"/friends/requests/update/" + friendshipId} state={{requestedAction: "reject"}}>Reject request</NavLink>
						</div>}
						{friendshipStatus === 'friends' &&
							<NavLink to={"/friends/add/" + userData.appUserId}>Remove friend</NavLink>}
					</div>
				</>
			}
		</Box>
	)
}

export default ProfilePublic