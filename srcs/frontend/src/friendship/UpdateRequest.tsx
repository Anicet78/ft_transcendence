import { Box } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink, useLocation, useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetBody } from '../types/GetType.ts'

type UpdateFriendRequestBodyType = GetBody<"/friends/{id}", "patch">;

const CancelRequest = () => {

	const id = useParams();
	const location = useLocation()
	const {requestedAction} = location.state || {}
	console.log(`${requestedAction}`)

	const UpdateFriendRequestBody: UpdateFriendRequestBodyType = {action: requestedAction}
	const { data, isLoading, isError, error } = useQuery({
		queryKey: [`/friends/${id}`, getAccessToken()],
		queryFn: () => api.patch(`/friends/${id}`, {id, UpdateFriendRequestBody}),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			Sent requests list
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				Friend request successfully cancelled!
			</Box>
			<NavLink to="/friends" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default CancelRequest