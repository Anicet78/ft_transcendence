import { Box } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink, useLocation, useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';

const UpdateRequest = () => {

	const id = useParams();
	const location = useLocation()
	const {requestedAction} = location.state || {}
	let action: string = ''

	if (requestedAction === 'cancel')
		action = 'cancelled'
	else if (requestedAction === 'accept')
		action = 'accepted'
	else if (requestedAction === 'reject')
		action = 'rejected'

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['friendship', getAccessToken()],
		queryFn: () => api.patch(`/friends/${id.id}`, {action: requestedAction}),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			Sent requests list
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				{"Friend request successfully " + action}
			</Box>
			<NavLink to="/friends/list" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default UpdateRequest
