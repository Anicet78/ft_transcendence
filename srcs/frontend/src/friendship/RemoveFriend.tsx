import { Box } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink, useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';

const RemoveFriend = () => {

	const id = useParams();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [`/friends/${id}`, getAccessToken()],
		queryFn: () => api.delete(`/friends/${id}`, id),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			Sent requests list
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				Friendship successfully removed
			</Box>
			<NavLink to="/friends" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default RemoveFriend