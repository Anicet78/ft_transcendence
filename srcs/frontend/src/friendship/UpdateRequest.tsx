import { Box } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink, useLocation, useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetBody, GetResponse } from '../types/GetType.ts'

type UpdateFriendRequestBodyType = GetBody<"/friends/{id}", "patch">;
type UpdateFriendRequestResponseType = GetResponse<"/friends/{id}", "patch">;

const UpdateRequest = () => {

	const id = useParams();
	const location = useLocation()
	const {requestedAction} = location.state || {}

	const UpdateFriendRequestBody: UpdateFriendRequestBodyType = {action: requestedAction}
	const { data, isLoading, isError, error } = useQuery({
		queryKey: [`/friends/${id}`, getAccessToken()],
		queryFn: () => api.patch(`/friends/${id}`, {id, UpdateFriendRequestBody}),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const cancelStatus: UpdateFriendRequestResponseType = data.data;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			Sent requests list
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				{cancelStatus ? "Friend request successfully cancelled!" : "Failed to cancel the friend request"}
			</Box>
			<NavLink to="/friends" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default UpdateRequest
