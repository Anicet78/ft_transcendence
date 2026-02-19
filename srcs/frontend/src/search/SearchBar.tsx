import { useState } from 'react';
import { useNavigate } from 'react-router';
import './SearchBar.css';
import { Button } from '@allxsmith/bestax-bulma';

const SearchBar = () => {
	const [search, setSearch] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!search.trim()) return; // removes unecessary whitespaces

		// encodeURIComponent: encodes a string so it can be safely used 
		// as part of a URL in query parameters even if the user used
		// characters which has special meaning in URLs
		navigate(`/search?q=${encodeURIComponent(search.trim())}`);
		setSearch('');
	};

	return (
		<form onSubmit={handleSubmit} className="search_form">
		<input
			className="search_input"
			type="text"
			placeholder="Search players..."
			value={search}
			onChange={(e) => setSearch(e.target.value)}
		/>
		<Button type="submit" className="is-primary">
			<i className="fas fa-search"></i>
		</Button>
		</form>
	);
};

export default SearchBar
