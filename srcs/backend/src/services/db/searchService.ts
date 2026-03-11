import { prisma } from './prisma.js';
import { Prisma } from '@prisma/client';
import type { SearchUsersQuery } from '../../schema/searchSchema.js';


function buildPagination(query: SearchUsersQuery) {
	const page = query.page ?? 1;
	const take = query.pageSize ?? 20;//result per page
	const skip = (page - 1) * take;// rows to skip (eg: page1: 0 to skip, page 2: 20 to skip)
	
	return { page, take, skip };
}

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

	if (query.minEnemiesKilled !== undefined || query.maxEnemiesKilled !== undefined) {
		filter.totalEnemiesKilled = {};
		if (query.minEnemiesKilled !== undefined)
			filter.totalEnemiesKilled.gte = query.minEnemiesKilled;
		if (query.maxEnemiesKilled !== undefined)
			filter.totalEnemiesKilled.lte = query.maxEnemiesKilled;
	}

	if (query.minBestTime !== undefined || query.maxBestTime !== undefined) {
		filter.bestTime = {};
		if (query.minBestTime !== undefined)
			filter.bestTime.gte = query.minBestTime;
		if (query.maxBestTime !== undefined)
			filter.bestTime.lte = query.maxBestTime;
	}

	if (query.minWins !== undefined || query.maxWins !== undefined) {
		filter.totalWins = {};
		if (query.minWins !== undefined)
			filter.totalWins.gte = query.minWins;
		if (query.maxWins !== undefined)
			filter.totalWins.lte = query.maxWins;
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

	if (query.alreadyFriends === undefined)
		return;

	const friendCondition = {
		OR: [
			{
				friendshipsSent: {
					some: {
						receiverId: userId,
						status: 'accepted',
						deletedAt: null,
					},
				},
			},
			{
				friendshipsReceived: {
					some: {
						senderId: userId,
						status: 'accepted',
						deletedAt: null,
					},
				},
			},
		],
	};

	if (query.alreadyFriends === true) {
		return friendCondition;
	}

	return {
		NOT: friendCondition,
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
			: [{ gameProfile: { [sortBy]: sortOrder } }]; // is it possible that game profile is null? if yes could be a problem

	//if 2 users have the same level, sort by username
	orderBy.push({ username: 'asc' });

	return orderBy;
}


export async function searchUsersService(userId: string, query: SearchUsersQuery) {
	
	const { page, take, skip } = buildPagination(query);

	const userFilters = buildUserFilters(userId, query);
	const blockFilters = buildBlockFilter(userId);
	const friendFilters = buildFriendFilter(userId, query);
	const gameProfileFilter = buildGameProfileFilter(query);
	
	const where: Prisma.AppUserWhereInput = {
		AND: [
			userFilters,
			blockFilters,
			...(friendFilters ? [friendFilters] : []),
			...(gameProfileFilter ? [{ gameProfile: { is: gameProfileFilter } }] : []),
		],
	};

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

	const userIdsOnPage = items.map(user => user.appUserId);

	const friendships = await prisma.friendship.findMany({
		where: {
			deletedAt: null,
			status: { in: ['waiting', 'accepted'] },
			OR: [
			{
				senderId: userId,
				receiverId: { in: userIdsOnPage },
			},
			{
				receiverId: userId,
				senderId: { in: userIdsOnPage },
			},
			],
		},
	});

	const friendshipMap = new Map<string, typeof friendships[number]>();

	for (const friendship of friendships) {
		const otherUserId =
			friendship.senderId === userId
			? friendship.receiverId
			: friendship.senderId;
		
		if (!otherUserId) continue;
		// prioritize accepted over waiting
		const existing = friendshipMap.get(otherUserId);

		if (!existing || existing.status === 'waiting') {
			friendshipMap.set(otherUserId, friendship);
		}
	}

	const mappedItems = items.map(user => {
		const relation = friendshipMap.get(user.appUserId);

		let friendshipStatus: 'none' | 'sent' | 'received' | 'friends' = 'none';
		let friendshipId: string | null = null;

		if (relation) {
			friendshipId = relation.friendshipId;
			if (relation.status === 'accepted') {
			friendshipStatus = 'friends';
			} else if (relation.status === 'waiting') {
			friendshipStatus =
				relation.senderId === userId ? 'sent' : 'received';
			}
		}

		return {
			...user,
			friendshipStatus,
			friendshipId,
		};
	});

	return {
		page,
		pageSize: take,
		total,
		totalPages: Math.ceil(total / take),
		items: mappedItems,
	};
}
