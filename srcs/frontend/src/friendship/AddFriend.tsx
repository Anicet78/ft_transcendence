import { Box } from "@allxsmith/bestax-bulma"
import "./friendList.css"

import { NavLink, useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';

const AddFriend = () => {

	const id = useParams();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [`/friends/${id}`, getAccessToken()],
		queryFn: () => api.post(`/friends/${id}`, id.toString()),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				Friendship request successfully sent!
			</Box>
			<NavLink to="/friends" className="button is-medium">Back to friends list</NavLink>
		</Box>
	)
}

export default AddFriend