import { useQuery } from '@tanstack/react-query';
import '../App.css'
import './profile.css'
import { Box, Button } from '@allxsmith/bestax-bulma';
import { useParams } from 'react-router';
import type { GetResponse } from '../types/GetType';
import api from '../serverApi';
import { NavLink } from 'react-router';

type ProfileResponseType = GetResponse<"/profile/{username}", "get">;

const ProfilePublic = () => {
	const username = useParams().username;

	const userQuery = useQuery({
		queryKey: ['profile', username],
		queryFn: async () => {
		const res = await api.get(`/profile/${username}`);
		return res.data;
	  },
	});

	const userId = userQuery.data?.appUserId;

	const friendshipQuery = useQuery({
		queryKey: ['friendship', username],
		queryFn: async () => {
			const res = await api.get(`/friends/status/${userId}`);
			return res.data.result;
		},
		enabled: !!userId,
	});

	if (userQuery.isLoading) return <p>Chargement...</p>;
	if (userQuery.isError || !userQuery.data) return <div>Erreur: {userQuery.error?.message || 'unknown'}</div>;
	if (friendshipQuery.isLoading) return <p>Chargement...</p>;
	if (friendshipQuery.isError || !friendshipQuery.data) return <div>Erreur: {friendshipQuery.error?.message || 'unknown'}</div>;

	const userData: ProfileResponseType = userQuery.data;
	const friendshipData: any = friendshipQuery.data;

	const avatar = userData.avatarUrl ? `http://localhost:3000/uploads/${userData.avatarUrl}` : '../assets/skull.svg';
	const level = userData.gameProfile?.level || '0';
	const xp = userData.gameProfile?.totalXp || '0';
	const isConnected = userData.availability || false;
	const isPlaying = userData.playing || false;
	const bestTime = userData.gameProfile?.bestTime || '0';
	const totalKills = userData.gameProfile?.totalEnemiesKilled || '0';
	const totalGames = userData.gameProfile?.totalGames || '0';
	const totalWins = userData.gameProfile?.totalWins || '0';
	const totalLoses = userData.gameProfile?.totalLoses || '0';
	const friendshipStatus = friendshipQuery.isSuccess ? friendshipData.status : 'unknown';
	const blockStatus = userData.blocked;

	console.log("friendshipQuery:", friendshipQuery);
	console.log("friendship data:", friendshipQuery.data);
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
							<div>
								<Button color="dark" disabled size='large'>Request pending</Button>
								<NavLink to={"/friends/requests/update/" + friendshipData.friendshipId} state={{requestedAction: "cancel"}} className="button is-medium">Cancel request</NavLink>
							</div>}
						{friendshipStatus === 'friends' &&
						<div>
							<NavLink to={"/friends/remove/" + userData.appUserId} className="button is-medium">Remove friend</NavLink>
							<br />
							<Button color='primary' isInverted aria-label='join button' size='medium'>Join / decline</Button>
							<br />
							<Button color='primary' isInverted aria-label='spectate button' size='medium'>Spectate</Button>
						</div>}
						{friendshipStatus === 'received' && 
						<div>
							<NavLink to={"/friends/requests/update/" + friendshipData.friendshipId} state={{requestedAction: "accept"}} className="button is-medium">Accept request</NavLink>
							<NavLink to={"/friends/requests/update/" + friendshipData.friendshipId} state={{requestedAction: "reject"}} className="button is-medium">Reject request</NavLink>
						</div>}
						{friendshipStatus === 'none' &&
							<NavLink to={"/friends/add/" + userData.appUserId} className="button is-medium">Send friendship request</NavLink>}
						{!blockStatus && <NavLink to={"/profile/" + userData.appUserId + "/block"} state={{requestedAction: "block"}} className="button is-medium">Block user</NavLink>}
						{blockStatus && <NavLink to={"/profile/" + userData.appUserId + "/unblock"} state={{requestedAction: "unblock"}} className="button is-medium">Unblock user</NavLink>}
					</div>
				</>
			}
		</Box>
	)
}

export default ProfilePublic
