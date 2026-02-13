import { Box } from '@allxsmith/bestax-bulma';

import { useQuery } from '@tanstack/react-query';
import api, { getAccessToken } from '../serverApi.ts';
import type { GetResponse } from '../types/GetType.ts'
import type { SearchUsersQuery } from "../../../backend/src/schema/searchSchema.js"
import { useLocation, NavLink } from "react-router"

type SearchUsersResponseType = GetResponse<"/users/search", "get">

const SearchResult = () => {
	let query: SearchUsersQuery = {}
	query.searchBar = useLocation().search

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['/users/search', getAccessToken()],
		queryFn: () => api.get('/users/search'),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Error: {error?.message || 'unknown'}</div>;

	const userData: SearchUsersResponseType = data.data;
	const listItems = userData.items.map(user => {
			return (
			<li key={user.appUserId}>
				{user.username}<NavLink to={"/profile/" + user.username} className="button is-medium">View profile</NavLink>
			</li>
			)
		})
	return (
		<Box bgColor="grey" textColor="black" className="wrapbox">
			<h1>
			Search results
			</h1>
			<Box m="4" p="6"  className="friendbox" bgColor="grey-light" textColor="black" justifyContent='space-between'>
				<ul>
				{listItems}
				<br />
			</ul>
			</Box>
		</Box>
	)
}

export default SearchResult