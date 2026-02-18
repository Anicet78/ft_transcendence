import { Box, Button } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts'
import { useAuth } from "../auth/AuthContext.tsx";

type FriendsListResponseType = GetResponse<"/friends", "get">;

const FriendList = () => {
	const { user } = useAuth()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['friends', getAccessToken()],
		queryFn: () => api.get("/friends"),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: FriendsListResponseType = data.data;
	const listItems = userData.map(friend => {
		return (
		<li key={friend.friendshipId}>
			{friend.sender.appUserId !== user?.id && <NavLink to={"/profile/" + friend.sender.username}>{friend.sender.username}</NavLink>}
			{friend.receiver.appUserId !== user?.id && <NavLink to={"/profile/" + friend.receiver.username}>{friend.receiver.username}</NavLink>}
			<Button>Join</Button>
			<Button>Spectate</Button>
		</li>
		)
	})

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			My friends list
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
			<ul>
				{listItems}
				<br />
			</ul>
			</Box>
			<NavLink to="/friends/requests" className="button is-medium">View ongoing friend requests</NavLink>
		</Box>
	)
}

export default FriendList