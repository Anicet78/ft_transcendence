import { prisma } from './prisma.js';
import { Prisma } from '@prisma/client';
import type { SearchUsersQuery } from '../../schema/searchSchema.js';


function buildPagination(query: SearchUsersQuery) {
	const page = query.page ?? 1;
	const take = query.pageSize ?? 20;//result per page
	const skip = (page - 1) * take;// rows to skip (eg: page1: 0 to skip, page 2: 20 to skip)
	
	return { page, take, skip };
}

// type GameProfileRangeField =
//   | 'level'
//   | 'totalGames'
//   | 'totalWins'
//   | 'bestTime';

// function buildGameProfileFilter(
// 	query: SearchUsersQuery
// ): Prisma.GameProfileWhereInput | undefined {

// 	const filter: Prisma.GameProfileWhereInput = {
// 		deletedAt: null,
// 	};

// 	const addRange = (
// 		field: 'level' | 'totalGames' | 'totalWins' | 'bestTime',//GameProfileRangeField
// 		min?: number,
// 		max?: number
// 	) => {
// 		if (min === undefined && max === undefined) return;

// 		filter[field] = {
// 			...(min !== undefined && { gte: min }),
// 			...(max !== undefined && { lte: max }),
// 		};
// 	};

// 	addRange('level', query.minLevel, query.maxLevel);
// 	addRange('totalGames', query.minGames, query.maxGames);
// 	addRange('totalWins', query.minWins, query.maxWins);
// 	addRange('bestTime', query.minBestTime, query.maxBestTime);


// 	return Object.keys(filter).length > 1 ? filter : undefined;
// }

// returns either a prisma filter object, representing a user 
// OR "undefined" if no filter is needed
function buildGameProfileFilter(query: SearchUsersQuery) {

	const filter: Prisma.GameProfileWhereInput = {
		deletedAt: null,
	};

	if (query.minLevel !== undefined || query.maxLevel !== undefined) {
		filter.level = {};
		if (query.minLevel !== undefined)
			filter.level.gte = query.minLevel;
		if (query.maxLevel !== undefined)
			filter.level.lte = query.maxLevel;
	}

	if (query.minGames !== undefined || query.maxGames !== undefined) {
		filter.totalGames = {};
		if (query.minGames !== undefined)
			filter.totalGames.gte = query.minGames;
		if (query.maxGames !== undefined)
			filter.totalGames.lte = query.maxGames;
	}

	if (Object.keys(filter).length === 1)
		return undefined;

	return filter;
}


function buildUserFilters(
	userId: string, 
	query: SearchUsersQuery): Prisma.AppUserWhereInput {

	//base filters: exclude deleted users and yourself
	const where: Prisma.AppUserWhereInput = {
		deletedAt: null,
		appUserId: { not: userId },
	};

	//searchBar: only allow username search
	if (query.searchBar) {
		where.username = {
			contains: query.searchBar,
			mode: 'insensitive',
		};
	}

	// check which filters are used, and map accordingly
	// need to use "undefined" because 'false' is a valid value!
	if (query.region)
		where.region = query.region;
	if (query.availability !== undefined)
		where.availability = query.availability;
	if (query.playing !== undefined)
		where.playing = query.playing;

	return where;
}

function buildBlockFilter(userId: string): Prisma.AppUserWhereInput {
	return {
		NOT: [
			{
				usersWhoBlockedYou: {
					some: { blocked: userId, deletedAt: null },
				},
			},
			{
				usersYouBlocked: {
					some: { blocker: userId, deletedAt: null },
				},
			},
		],
	};
}

function buildFriendFilter(
	userId: string, 
	query: SearchUsersQuery) : Prisma.AppUserWhereInput | undefined {

	if (query.alreadyFriends !== false)
		return;

	return {
		AND: [
			{
			friendshipsSent: {
				none: {
				receiverId: userId,
				status: 'accepted',
				deletedAt: null,
				},
			},
			},
			{
			friendshipsReceived: {
				none: {
				senderId: userId,
				status: 'accepted',
				deletedAt: null,
				},
			},
			},
		],
	};
}

function buildSorting(query: SearchUsersQuery): Prisma.AppUserOrderByWithRelationInput[] {
	
	const sortBy = query.sortBy ?? 'level'; //(nina) have to decide what is the default sorting
	const sortOrder = query.sortOrder ?? 'desc';

	// const orderBy = sortBy === 'createdAt'
	// 	? [{ createdAt: sortOrder }]
	// 	: [{ gameProfile: { [sortBy]: sortOrder } }];

	//build prisma sorting :
	// if sorting by createdAt → sort on AppUser
	// otherwise → sort on GameProfile fields
	const orderBy: Prisma.AppUserOrderByWithRelationInput[] =
		sortBy === 'createdAt'
			? [{ createdAt: sortOrder }]
			: [{ gameProfile: { [sortBy]: sortOrder } }];

	//if 2 users have the same level, sort by username
	orderBy.push({ username: 'asc' });

	return orderBy;
}


export async function searchUsersService(userId: string, query: SearchUsersQuery) {
	
	const { page, take, skip } = buildPagination(query);

	const where: Prisma.AppUserWhereInput = {
		...buildUserFilters(userId, query),
		...buildBlockFilter(userId),
		...buildFriendFilter(userId, query),
	};

	const gameProfileFilter = buildGameProfileFilter(query);

	if (gameProfileFilter) {
		where.gameProfile = { is: gameProfileFilter };
	}

	const orderBy = buildSorting(query);

	// Execute prisma queries in parallel:
	// 	fetch actual users + count results for pagination
	//	promise.all = runs them in parallel to make request faster
	const [items, total] = await Promise.all([
		prisma.appUser.findMany({
			where,
			include: { gameProfile: true },
			orderBy,
			skip,
			take,
		}),
		prisma.appUser.count({ where }),
	]);

	return {
		page,
		pageSize: take,
		total,
		totalPages: Math.ceil(total / take),
		items,
	};
}


// export async function searchUsersService( userId: string, query: SearchUsersQuery) {
	
// 	// 1. handle pagination
// 	const page = query.page ?? 1;
// 	const take = query.pageSize ?? 20;//result per page
// 	const skip = (page - 1) * take;// rows to skip (eg: page1: 0 to skip, page 2: 20 to skip)

// 	// 2. base filters: exclude deleted users and yourself
// 	const where: any = {
// 		deletedAt: null,
// 		appUserId: { not: userId},
// 	};

// 	// 3. searchBar: only allow username search
// 	if (query.searchBar)
// 		where.username = { contains: query.searchBar, mode: 'insensitive' };

// 	//4. check which filters are used, and map accordingly
// 	// need to "use" undefined because 'false' is a valid value!
// 	if (query.region)
// 		where.region = query.region;
// 	if (query.availability !== undefined)
// 		where.availability = query.availability;
// 	if (query.playing !== undefined)
// 		where.playing = query.playing;

// 	const gameProfile: any = { deletedAt: null };

// 	//5. create "range" helper function to allow filtering with min and max value)
// 	const range = (
// 		field: string,
// 		minValue?: number,
// 		maxValue?: number
// 	) => {
// 		if (minValue !== undefined)
// 			gameProfile[field] = { ...(gameProfile[field] || {}), gte: minValue };//ensures we don’t overwrite existing constraints
// 		if (maxValue !== undefined)
// 			gameProfile[field] = { ...(gameProfile[field] || {}), lte: maxValue };
// 	};

// 	range('level', query.minLevel, query.maxLevel);
// 	range('totalGames', query.minGames, query.maxGames);
// 	range('totalWins', query.minWins, query.maxWins);
// 	range('bestTime', query.minBestTime, query.maxBestTime);


// 	//6. exclude both users who blocked you AND users you blocked
// 	where.NOT = [
// 		{
// 			usersWhoBlockedYou: {//usersWhoBlockedYou
// 				some: {
// 					blocked: userId,
// 					deletedAt: null
// 				},
// 			},
// 			usersYouBlocked: {//usersYouBlocked
// 				some: {
// 					blocker: userId,
// 					deletedAt: null
// 				},
// 			},
// 		},
// 	];

// 	//7. exclude existing friends (if want to check friendlist, check friends route)
// 	if (query.alreadyFriends === false) {
// 		where.AND = [
// 			{
// 				friendshipsSent: {
// 					none: {
// 						receiverId: userId,
// 						status: { in: ['accepted']},
// 						deletedAt: null,
// 					},
// 				},
// 			},
// 			{
// 				friendshipsReceived: {
// 					none: {
// 						senderId: userId,
// 						status: { in: ['accepted']},
// 						deletedAt: null,
// 					},
// 				},
// 			},
// 		];
// 	}

// 	//8. sorting 
// 	const sortBy = query.sortBy ?? 'level'; //(nina) have to decide what is the default sorting
// 	const sortOrder = query.sortOrder ?? 'desc';

// 	//9. build prisma sorting :
// 	// if sorting by createdAt → sort on AppUser
// 	// otherwise → sort on GameProfile fields
// 	const orderBy: any[] = sortBy === 'createdAt'
// 		? [{ createdAt: sortOrder }]
// 		: [{ gameProfile: { [sortBy]: sortOrder } }];

// 	//if 2 users have the same level, sort by username
// 	orderBy.push({ username: 'asc' });

// 	// 10. execute prisma queries in parallel:
// 	// 	fetch actual users + count results for pagination
// 	//	promise.all = runs them in parallel to make request faster
// 	const [items, total] = await Promise.all([
// 		prisma.appUser.findMany({
// 			where,
// 			include: { gameProfile: true },
// 			orderBy,
// 			skip,
// 			take,
// 		}),
// 		prisma.appUser.count({ where }),
// 	]);

// 	return {
// 		page,
// 		pageSize: take,
// 		total,
// 		totalPages: Math.ceil(total / take),
// 		items,
// 	};
// }