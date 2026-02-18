import { Box, Button } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts'
import { useAuth } from "../auth/AuthContext.tsx";

type FriendsListResponseType = GetResponse<"/friends/list", "get">;

const FriendList = () => {
	const { user } = useAuth()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['friends', getAccessToken()],
		queryFn: () => api.get("/friends/list"),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: FriendsListResponseType = data.data;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>My friends list</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
			<ul className="user_list">
					{userData.map(friend => {
						const friendUser = friend.sender.appUserId !== user?.id ? friend.sender : friend.receiver;
						const avatarUrl = friendUser.avatarUrl 
							? `http://localhost:3000/uploads/${friendUser.avatarUrl}`
							: '../assets/skull.svg';

						return (
							<li key={friend.friendshipId} className="user_item_card">
								<img src={avatarUrl} alt={friendUser.username} className="user_avatar"/>
								<p className="username">{friendUser.username}</p>
								<div className="friend_actions">
									<Button className="interaction_btn">Join</Button>
									<Button className="interaction_btn">Spectate</Button>
									<NavLink to={"/profile/" + friendUser.username} className="view_profile_btn">
										View Profile
									</NavLink>
								</div>
							</li>
						)
					})}
				</ul>
			</Box>
			<NavLink to="/friends/requests" className="button is-medium">View ongoing friend requests</NavLink>
		</Box>
	)
}

export default FriendList