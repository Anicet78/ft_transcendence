import { getAccessToken } from '../serverApi.ts';

export type actionType =
| 'accept'
| 'reject'
| 'cancel'
| 'add'
| 'remove'
| 'block'
| 'unblock';

// Queries needing invalidation when changing friendship status
const friendshipQueries = (username?: string) => [
	['/friends/requests', getAccessToken()], // pending requests list
	['friendship', username], // friendship status for a profile
	['profile', username], // user profile
];

export default friendshipQueries
