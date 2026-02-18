import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import './SearchBar.css';
import { Button } from '@allxsmith/bestax-bulma';
import { SelectFilter } from './SelectFilter';
import { BooleanFilter } from './BooleanFilter';
import { RangeFilter } from './RangeFilter';

const regions = ['NA', 'EU', 'SAM', 'MENA', 'OCE', 'APAC', 'SSA'] as const;
const sortFields = ['level', 'totalGames', 'totalWins', 'totalEnemiesKilled', 'totalXp', 'bestTime', 'createdAt'] as const;

const SearchBar = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [search, setSearch] = useState('');
	const [showFilters, setShowFilters] = useState(false);

	const [region, setRegion] = useState<string | ''>('');
	const [availability, setAvailability] = useState<boolean | ''>('');
	const [playing, setPlaying] = useState<boolean | ''>('');
	const [minLevel, setMinLevel] = useState<number | ''>('');
	const [maxLevel, setMaxLevel] = useState<number | ''>('');
	const [minGames, setMinGames] = useState<number | ''>('');
	const [maxGames, setMaxGames] = useState<number | ''>('');
	const [minEnnemies, setminEnnemies] = useState<number | ''>('');
	const [maxEnnemies, setmaxEnnemies] = useState<number | ''>('');
	const [minBestTimes, setMinBestTimes] = useState<number | ''>('');
	const [maxBestTimes, setMaxBestTimes] = useState<number | ''>('');
	const [alreadyFriends, setAlreadyFriends] = useState<boolean | ''>('');
	const [sortBy, setSortBy] = useState<typeof sortFields[number]>('level');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	useEffect(() => {
		setSearch(searchParams.get('searchBar') || '');
		setRegion(searchParams.get('region') || '');
		setAvailability(
			searchParams.get('availability') === null ? '' : searchParams.get('availability') === 'true'
		);
		setMinLevel(searchParams.get('minLevel') ? Number(searchParams.get('minLevel')) : '');
		setMaxLevel(searchParams.get('maxLevel') ? Number(searchParams.get('maxLevel')) : '');
		setSortBy((searchParams.get('sortBy') as any) || 'level');
		setSortOrder((searchParams.get('sortOrder') as any) || 'desc');
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();

		if (search.trim()) params.set('searchBar', search.trim());
		if (region) params.set('region', region);
		if (availability !== '') params.set('availability', String(availability));
		if (minLevel !== '') params.set('minLevel', String(minLevel));
		if (maxLevel !== '') params.set('maxLevel', String(maxLevel));
		params.set('sortBy', sortBy);
		params.set('sortOrder', sortOrder);

		params.set('page', '1');
		params.set('pageSize', '5');
		navigate(`/search?${params.toString()}`);
		setShowFilters(false); // hide panel after applying
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
		<Button type="button" className="is-primary" onClick={() => setShowFilters((prev) => !prev)}>
        	<i className="fas fa-sliders"></i>
		</Button>
		{showFilters && (
			<div className="filter_panel">
			<SelectFilter<typeof regions[number]>
				value={region}
				onChange={setRegion}
				options={regions}
				placeholder="Region"
			/>
			<BooleanFilter value={availability} onChange={setAvailability} label="availability status" />
			<BooleanFilter value={playing} onChange={setPlaying} label='playing status' />
			<RangeFilter min={minLevel} max={maxLevel} onChangeMin={setMinLevel} onChangeMax={setMaxLevel} label="Level" />
			<RangeFilter min={minGames} max={maxGames} onChangeMin={setMinGames} onChangeMax={setMaxGames} label="Games" />
			<RangeFilter min={minEnnemies} max={maxEnnemies} onChangeMin={setminEnnemies} onChangeMax={setmaxEnnemies} label="Ennemies killed" />
			<RangeFilter min={minBestTimes} max={maxBestTimes} onChangeMin={setMinBestTimes} onChangeMax={setMaxBestTimes} label="Best times" />
			<BooleanFilter value={alreadyFriends} onChange={setAlreadyFriends} label='friendship status' />
			<SelectFilter<typeof sortFields[number]>
				value={sortBy}
				onChange={setSortBy}
				options={sortFields}
				placeholder="Sort by"
			/>
			<SelectFilter<'asc' | 'desc'>
				value={sortOrder}
				onChange={setSortOrder}
				options={['asc', 'desc']}
				placeholder="Sort order"
			/>
			</div>
		)}
		<Button type="submit" className="is-primary">
			<i className="fas fa-search"></i>
		</Button>
		</form>
	);
};

export default SearchBar;
