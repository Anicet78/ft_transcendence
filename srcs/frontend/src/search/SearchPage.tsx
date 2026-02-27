import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router';
import api from '../serverApi';
import { Box, Button } from '@allxsmith/bestax-bulma';
import '../App.css'
import './SearchPage.css'
import skull from '../assets/skull.svg';
import { useFriendshipModification } from '../friendship/useFriendshipModification';
import type { actionType } from '../friendship/friendshipQueries';

type UserItem = {
	appUserId: string;
	username: string;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
	friendshipStatus: 'none' | 'sent' | 'received' | 'friends';
	friendshipId?: string;
};

type SearchResponse = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	items: UserItem[];
};

const PAGE_SIZE = 5; // change as needed

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const friendRequestMutation = useFriendshipModification();

	const [results, setResults] = useState<UserItem[]>([]);
	const [loading, setLoading] = useState(false);
	const page = Number(searchParams.get('page') || 1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchUsers = async () => {
		try {
			setLoading(true);

			const params = new URLSearchParams(searchParams);
			// Ensure pagination defaults
			if (!params.get('page')) params.set('page', '1');
			if (!params.get('pageSize')) params.set('pageSize', PAGE_SIZE.toString());

			const response = await api.get(`/users/search?${params.toString()}`);
			const data: SearchResponse = response.data;
			setResults(Array.isArray(data.items) ? data.items : []);
			setTotalPages(data.totalPages || 1);
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [searchParams]);

	const navigateWithParams = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set('page', newPage.toString());
		navigate(`/search?${params.toString()}`);
	};

	const handleRequest = async (action: actionType, id: string) => {
	try {
		if (action === 'add') {
			setResults(prev =>
				prev.map(user => user.appUserId === id
					? { ...user, friendshipStatus: 'sent' } // temporary until server returns friendshipId
					: user)
			);
			await friendRequestMutation.run(action, id);
			fetchUsers();
		} else {
			const previousResults = [...results];
			setResults(prev =>
				prev.map(user => {
					if (user.friendshipId === id || user.appUserId === id) {
						switch(action) {
						case 'accept': return { ...user, friendshipStatus: 'friends' };
						case 'reject': return { ...user, friendshipStatus: 'none', friendshipId: undefined };
						case 'cancel': return { ...user, friendshipStatus: 'none', friendshipId: undefined };
						case 'remove': return { ...user, friendshipStatus: 'none', friendshipId: undefined };
						default: return user;
						}
					}
					return user;
				})
			);

			await friendRequestMutation.run(action, id).catch(err => {
				// Rollback from optimistic update above if mutation fails
				setResults(previousResults);
				console.error('Friend request failed:', err);
			});
		}
	} catch (err) {
    console.error('Friend request failed:', err);
  }
};

	return (
		<Box m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' alignItems='center'>
			<h1>Search Results</h1>
			<Box className='user_list' bgColor="white" textSize='5'>
				{loading && <p>Loading...</p>}

				{!loading && results?.length === 0 && (<p>No player found</p>)}

				{results?.length > 0 && results.map((user) => (
					<div key={user.appUserId} className="user_item_card">
						{user.avatarUrl && (
							<img src={`https://${window.location.host}/uploads/` + user.avatarUrl} alt={user.username} className="user_avatar"/>)}
						{!user.avatarUrl && (
							<img src={skull} alt={user.username} className="user_avatar"/>)}
							<p className="username">{user.username}</p>
							{user.friendshipStatus === 'none' && 
								<Button 
									className="interaction_btn" 
									onClick={() => {handleRequest("add", user.appUserId)}}
								>
									Send friendship request
								</Button>
							}
							{user.friendshipStatus === 'sent' && 
								<Button 
									className="interaction_btn" 
									disabled={!user.friendshipId}
									onClick={() => {handleRequest("cancel", user.friendshipId!)}}
								>
									Cancel friendship request
								</Button>
							}
							{user.friendshipStatus === 'received' && 
								<div>
								<Button 
									className="interaction_btn" 
									disabled={!user.friendshipId}
									onClick={() => {handleRequest("accept", user.friendshipId!)}}
								>
									Accept friendship request
								</Button>
								<Button 
									className="interaction_btn" 
									disabled={!user.friendshipId}
									onClick={() => {handleRequest("reject", user.friendshipId!)}}
								>
									Reject friendship request
								</Button>
								</div>
							}
							{user.friendshipStatus === 'friends' && 
								<Button 
									className="interaction_btn" 
									onClick={() => {handleRequest("remove", user.appUserId)}}
								>
									Remove friend
								</Button>
							}
							<NavLink to={"/profile/" + user.username} className="view_profile_btn">View Profile</NavLink>
					</div>
				))}

				{totalPages > 1 && (
					<div className="pagination">
						<button onClick={() => navigateWithParams(page - 1)} disabled={page === 1}>Previous</button>
						<span>Page {page} of {totalPages}</span>
						<button onClick={() => navigateWithParams(page + 1)} disabled={page === totalPages}>Next</button>
					</div>
				)}
			</Box>
		</Box>
	);
};

export default SearchPage
