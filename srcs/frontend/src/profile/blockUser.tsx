import { Box } from "@allxsmith/bestax-bulma"
import "./profile.css"

import { NavLink, useLocation } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';

const BlockUser = () => {

	const location = useLocation()
	const {requestedAction} = location.state || {}

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [location.pathname, getAccessToken()],
		queryFn: () => api.post(location.pathname),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				{requestedAction === 'block' &&"User successfully blocked!"}
				{requestedAction === 'unblock' &&"User successfully unblocked!"}

			</Box>
			<NavLink to="/friends/list" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default BlockUser