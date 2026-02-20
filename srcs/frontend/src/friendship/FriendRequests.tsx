import { Box, Button } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink } from "react-router";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts'
import { useAuth } from "../auth/AuthContext.tsx";
import toast from '../Notifications.tsx';
import { useState } from "react";

type FriendRequestResponseType = GetResponse<"/friends/requests", "get">;

const FriendRequest = () => {

	const { user } = useAuth()
	const queryClient = useQueryClient();

	const [loadingId, setLoadingId] = useState<string | null>(null);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['/friends/requests', getAccessToken()],
		queryFn: () => api.get("/friends/requests"),
	});

	const requestMutation = useMutation({
		mutationFn:({ requestedAction, friendId }: { requestedAction: string; friendId: string }) => 
    api.patch(`/friends/${friendId}`, { action: requestedAction }),
		onSuccess: () => {
			queryClient.invalidateQueries(['/friends/requests', getAccessToken()]);
			toast({ title: 'Request successful', type: "is-success" });
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		}
	})

	const handleRequest = (action: string, friendId: string) => {
		setLoadingId(friendId);
		requestMutation.mutate(
			{ action, friendId },
			{ onSettled: () => setLoadingId(null) }
		);
	};
	
	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: FriendRequestResponseType = data.data;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>Ongoing friend requests</h1>
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
								{friendUser.appUserId === friend.sender.appUserId && 
								<div>
									<Button 
										className="interaction_btn" 
										onClick={() => {handleRequest('accept', friendUser.appUserId)}} 
										disabled={loadingId === friendUser.appUserId}
									>
										{loadingId === friendUser.appUserId ? 'Processing...' : 'Accept request'}
									</Button>
									<Button 
										className="interaction_btn" 
										onClick={() => {handleRequest('reject', friendUser.appUserId)}} 
										disabled={loadingId === friendUser.appUserId}
									>
										{loadingId === friendUser.appUserId ? 'Processing...' : 'Reject request'}
									</Button>
								</div>}
								{friendUser.appUserId !== friend.sender.appUserId && 
									<Button 
										className="interaction_btn" 
										onClick={() => {handleRequest('cancel', friendUser.appUserId)}} 
										disabled={loadingId === friendUser.appUserId}
									>
										{loadingId === friendUser.appUserId ? 'Processing...' : 'Cancel request'}
									</Button>
								}
								
								<NavLink to={"/profile/" + friendUser.username} className="view_profile_btn">
									View Profile
								</NavLink>
							</div>
						</li>
					)
				})}
			</ul>
			</Box>
			<NavLink to="/friends/list" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default FriendRequest