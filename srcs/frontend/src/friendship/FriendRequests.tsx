import { Box } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts'

type FriendRequestResponseType = GetResponse<"/friends/requests", "get">;

const FriendRequest = () => {

	const myUsername = "nina"

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['/friends/requests', getAccessToken()],
		queryFn: () => api.get("/friends/requests"),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: FriendRequestResponseType = data.data;
	const listItems = userData.map(friend => {
		return (
		<li key={friend.friendshipId}>
			{friend.sender.username !== myUsername && 
				<NavLink to={"/profile/" + friend.sender.appUserId}>{friend.sender.username}</NavLink>}
			{friend.receiver.username !== myUsername && 
				<NavLink to={"/profile/" + friend.receiver.appUserId}>{friend.receiver.username}</NavLink>}
			{friend.sender.username === myUsername && 
				<NavLink to={"/friends/requests/update/" + friend.friendshipId} state={{requestedAction: "cancel"}} className="button is-medium">Cancel request</NavLink>}
			{friend.sender.username !== myUsername && 
				<>
					<NavLink to={"/friends/requests/update/" + friend.friendshipId} state={{requestedAction: "accept"}} className="button is-medium">Accept request</NavLink>
					<NavLink to={"/friends/requests/update/" + friend.friendshipId} state={{requestedAction: "reject"}} className="button is-medium">Reject request</NavLink>
				</>}
		</li>
		)
	})

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			Sent requests list
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
			<ul>
				{listItems}
				<br />
			</ul>
			</Box>
			<NavLink to="/friends" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default FriendRequest