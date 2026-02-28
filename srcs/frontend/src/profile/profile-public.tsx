import { useQuery } from '@tanstack/react-query';
import '../App.css'
import './profile.css'
import { Box, Button } from '@allxsmith/bestax-bulma';
import { useParams } from 'react-router';
import type { GetResponse } from '../types/GetType';
import api from '../serverApi';
import skull from '../assets/skull.svg';
import { useFriendshipModification } from '../friendship/useFriendshipModification.tsx';
import type { actionType } from '../friendship/friendshipQueries.ts';

type ProfileResponseType = GetResponse<"/profile/{username}", "get">;

const ProfilePublic = () => {
	const username = useParams().username;
	const friendshipModification = useFriendshipModification(username);

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

	const handleModification = (action: actionType, id: string) => {
		friendshipModification.run( action, id);
	};

	if (userQuery.isLoading) return <p>Loading...</p>;
	if (userQuery.isError || !userQuery.data) return <div>Erreur: {userQuery.error?.message || 'unknown'}</div>;
	if (friendshipQuery.isLoading) return <p>Loading...</p>;
	if (friendshipQuery.isError || !friendshipQuery.data) return <div>Erreur: {friendshipQuery.error?.message || 'unknown'}</div>;

	const userData: ProfileResponseType = userQuery.data;
	const friendshipData: any = friendshipQuery.data;

	const avatar = userData.avatarUrl ? `https://${window.location.host}/uploads/${userData.avatarUrl}` : skull;
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

	return (
		<div className='profile-box'>
			<div className='box-head'>
				<div className='image-box'>
						<img aria-label='avatar of the user' src={avatar} />
				</div>
				<div className='head-text'>
					<div className='profile_username'>
						<i className={`fa-solid fa-circle status-circle ${isPlaying ? 'playing' : isConnected ? 'online' : 'offline'}`}  aria-label="status" />
						{username}
					</div>
					<p>Lvl {level}</p>
					<p>{xp} XP</p>
				</div>
			</div>
			<div className='public-info'>
				<p><span className='category-name'>Best time:</span>{bestTime}</p>
				<p><span className='category-name'>Total kills:</span>{totalKills}</p>
				<p><span className='category-name'>Total games:</span>{totalGames}</p>
				<p><span className='category-name'>Total wins:</span>{totalWins}</p>
				<p><span className='category-name'>Total loses:</span>{totalLoses}</p>
			</div>
			{friendshipStatus !== 'self' &&
				<>
					<div className="button-group">
						{(friendshipStatus === 'sent') &&
							<div className="button-row">
								<Button color="dark" disabled size='large' className='profile-button'>Request pending</Button>
								<Button
									size='large'
									onClick={() => {handleModification('cancel', friendshipData.friendshipId)}}
									className='profile-button'
								>
									Cancel request
								</Button>
							</div>}
						{friendshipStatus === 'friends' &&
							<div>
								<div className="button-row">
									<Button
										size='large'
										onClick={() => {handleModification('remove', userId)}}
										className='profile-button'
									>
										Remove friend
									</Button>
								</div>
								<div className="button-row">
									<Button aria-label='join button' size='large' className='profile-button'>Join</Button>
									<Button aria-label='spectate button' size='large' className='profile-button'>Spectate</Button>
								</div>
							</div>}
						{friendshipStatus === 'received' &&
							<div className="button-row">
								<Button
									size='large'
									onClick={() => {handleModification('accept', friendshipData.friendshipId)}}
									className='profile-button'
								>
									Accept request
								</Button>
								<Button
									size='large'
									onClick={() => {handleModification('reject', friendshipData.friendshipId)}}
									className='profile-button'
								>
									Reject request
								</Button>
							</div>}
						{friendshipStatus === 'none' && <Button
								size='large'
								onClick={() => {handleModification('add', userId)}}
								className='profile-button'
							>
								Send friendship request
							</Button>}
						{!blockStatus && <Button
							size='large'
							onClick={() => {handleModification('block', userId)}}
							className='profile-button'
						>
							Block user
						</Button>}
						{blockStatus && <Button
							size='large'
							onClick={() => {handleModification('unblock', userId)}}
							className='profile-button'
						>
							Unblock user
						</Button>}
					</div>
				</>
			}
		</div>
	)
}

export default ProfilePublic
