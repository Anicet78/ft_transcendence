import { Button } from "@allxsmith/bestax-bulma"
import { NavLink } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts'
import { useAuth } from "../auth/AuthContext.tsx";
import { useFriendshipModification } from "./useFriendshipModification.tsx";
import type { actionType } from "./friendshipQueries.ts";
import skull from '../assets/skull.svg';

type FriendRequestResponseType = GetResponse<"/friends/requests", "get">;

const FriendRequest = () => {

	const { user } = useAuth();
	const friendRequestMutation = useFriendshipModification();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['/friends/requests', getAccessToken()],
		queryFn: () => api.get("/friends/requests"),
	});

	const handleRequest = (action: actionType, id: string) => {
		friendRequestMutation.run( action, id);
	};

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: FriendRequestResponseType = data.data;

	return (
		<div className="wrapbox">
			<h2>Ongoing friend requests</h2>
			<div className="friendbox">
			<ul className="user_list">
				{userData.map(friend => {
					const friendUser = friend.sender.appUserId !== user?.id ? friend.sender : friend.receiver;
					const avatarUrl = friendUser.avatarUrl 
						? `https://${window.location.host}/uploads/${friendUser.avatarUrl}`
						: skull;

					return (
						<li key={friend.friendshipId} className="user_item_card">
							<img src={avatarUrl} alt={friendUser.username} className="user_avatar"/>
							<p className="username">{friendUser.username}</p>
							<div className="friend_actions">
								{friendUser.appUserId === friend.sender.appUserId &&
									<Button
										className="interaction_btn"
										onClick={() => {handleRequest('accept', friend.friendshipId)}}
									>
										Accept request
									</Button>}
								{friendUser.appUserId === friend.sender.appUserId &&
									<Button
										className="interaction_btn"
										onClick={() => {handleRequest('reject', friend.friendshipId)}}
									>
										Reject request
									</Button>}
								{friendUser.appUserId !== friend.sender.appUserId &&
									<Button
										className="interaction_btn"
										onClick={() => {handleRequest('cancel', friend.friendshipId)}}
									>
										Cancel request
									</Button>
								}
								
								<NavLink to={"/profile/" + friendUser.username} className="button view_profile_btn">
									View Profile
								</NavLink>
							</div>
						</li>
					)
				})}
			</ul>
			<div className="bottom-button">
				<NavLink to="/friends/list" className="button is-large friendlist-button">Back to friends list</NavLink>
				<NavLink to="/profile" className="button is-large myprofile-button">Back to profile</NavLink>
			</div>
			</div>
		</div>
	)
}

export default FriendRequest
