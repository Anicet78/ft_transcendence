import Type, { type Static } from 'typebox';
import { region_list } from '@prisma/client';

export const SortByEnum = Type.Union([
	Type.Literal('level'),
	Type.Literal('totalGames'),
	Type.Literal('totalWins'),
	Type.Literal('totalEnemiesKilled'),
	Type.Literal('totalXp'),
	Type.Literal('bestTime'),
	Type.Literal('createdAt'),
]);

export const SortOrderEnum = Type.Union([
	Type.Literal('asc'),
	Type.Literal('desc'),
]);

//SEARCH USER USING FILTERS
export const SearchUsersQuerySchema = Type.Object({

	searchBar: Type.Optional(Type.String()),

	region: Type.Optional(Type.Enum(region_list)),
	
	availability: Type.Optional(Type.Boolean()),
	playing: Type.Optional(Type.Boolean()),

	//options to limit search to range of values
	minLevel: Type.Optional(Type.Number()),
	maxLevel: Type.Optional(Type.Number()),

	minGames: Type.Optional(Type.Number()),
	maxGames: Type.Optional(Type.Number()),

	minWins: Type.Optional(Type.Number()),
	maxWins: Type.Optional(Type.Number()),

	minEnemiesKilled: Type.Optional(Type.Number()), // too shady ?
	maxEnemiesKilled: Type.Optional(Type.Number()),

	minBestTime: Type.Optional(Type.Number()),
	maxBestTime: Type.Optional(Type.Number()),

	//option to select based on friendship status
	alreadyFriends: Type.Optional(Type.Boolean()),

	//rendering options: number of results per page
	page: Type.Optional(Type.Number({ minimum: 1 })),
	pageSize: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),

	//sorting option inside a page
	sortBy: Type.Optional(Type.Union([
		Type.Literal('level'),
		Type.Literal('totalGames'),
		Type.Literal('totalWins'),
		Type.Literal('totalEnemiesKilled'),
		Type.Literal('totalXp'),
		Type.Literal('bestTime'),
		Type.Literal('createdAt'),
	])),

	sortOrder: Type.Optional(Type.Union([
		Type.Literal('asc'),
		Type.Literal('desc'),
	])),

});
export type SearchUsersQuery = Static<typeof SearchUsersQuerySchema>;


export const SearchUsersResponseSchema = Type.Object({

	page: Type.Number(),
	pageSize: Type.Number(),
	total: Type.Number(),
	totalPages: Type.Number(),
	items: Type.Array(
	Type.Object({
		appUserId: Type.String(),
		username: Type.String(),
		firstName: Type.String(),
		lastName: Type.String(),
		region: region_list,
		availability: Type.Boolean(),
		playing: Type.Boolean(),
		avatarUrl: Type.Optional(Type.String()),
		gameProfile: Type.Optional(
		Type.Object({
			gameProfileId: Type.String(),
			level: Type.Number(),
			totalGames: Type.Number(),
			totalWins: Type.Number(),
			totalLoses: Type.Number(),
			totalEnemiesKilled: Type.Number(),
			totalXp: Type.Number(),
			bestTime: Type.Number(),
		})
		),
	})
	),
});
