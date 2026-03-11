import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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

	const [minEnemiesKilled, setMinEnemies] = useState<number | ''>('');
	const [maxEnemiesKilled, setMaxEnemies] = useState<number | ''>('');

	const [minBestTime, setMinBestTime] = useState<number | ''>('');
	const [maxBestTime, setMaxBestTime] = useState<number | ''>('');
	
	const [alreadyFriends, setAlreadyFriends] = useState<boolean | ''>('');
	const [sortBy, setSortBy] = useState<typeof sortFields[number]>('level');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	useEffect(() => {
		setSearch(searchParams.get('searchBar') || '');
		setRegion(searchParams.get('region') || '');
		setAvailability(
			searchParams.get('availability') === null ? '' : searchParams.get('availability') === 'true'
		);
		setPlaying(
			searchParams.get('playing') === null ? '' : searchParams.get('playing') === 'true'
		);

		setMinLevel(searchParams.get('minLevel') ? Number(searchParams.get('minLevel')) : '');
		setMaxLevel(searchParams.get('maxLevel') ? Number(searchParams.get('maxLevel')) : '');

		setMinGames(searchParams.get('minGames') ? Number(searchParams.get('minGames')) : '');
		setMaxGames(searchParams.get('maxGames') ? Number(searchParams.get('maxGames')) : '');

		setMinEnemies(searchParams.get('minEnemiesKilled') ? Number(searchParams.get('minEnemiesKilled')) : '');
		setMaxEnemies(searchParams.get('maxEnemiesKilled') ? Number(searchParams.get('maxEnemiesKilled')) : '');

		setMinBestTime(searchParams.get('minBestTime') ? Number(searchParams.get('minBestTime')) : '');
		setMaxBestTime(searchParams.get('maxBestTime') ? Number(searchParams.get('maxBestTime')) : '');

		setAlreadyFriends(
			searchParams.get('alreadyFriends') === null ? '' : searchParams.get('alreadyFriends') === 'true'
		);
		setSortBy((searchParams.get('sortBy') as any) || 'level');
		setSortOrder((searchParams.get('sortOrder') as any) || 'desc');
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();

		if (search.trim()) params.set('searchBar', search.trim());
		if (region) params.set('region', region);

		if (availability !== '') params.set('availability', String(availability));
		if (playing !== '') params.set('playing', String(playing));

		if (minLevel !== '') params.set('minLevel', String(minLevel));
		if (maxLevel !== '') params.set('maxLevel', String(maxLevel));

		if (minGames !== '') params.set('minGames', String(minGames));
		if (maxGames !== '') params.set('maxGames', String(maxGames))

		if (minEnemiesKilled !== '') params.set('minEnemiesKilled', String(minEnemiesKilled));
		if (maxEnemiesKilled !== '') params.set('maxEnemiesKilled', String(maxEnemiesKilled));

		if (minBestTime !== '') params.set('minBestTime', String(minBestTime));
		if (maxBestTime !== '') params.set('maxBestTime', String(maxBestTime));

		if (alreadyFriends !== '') params.set('alreadyFriends', String(alreadyFriends));
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
			<RangeFilter min={minEnemiesKilled} max={maxEnemiesKilled} onChangeMin={setMinEnemies} onChangeMax={setMaxEnemies} label="Enemies killed" />
			<RangeFilter min={minBestTime} max={maxBestTime} onChangeMin={setMinBestTime} onChangeMax={setMaxBestTime} label="Best time" />
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
