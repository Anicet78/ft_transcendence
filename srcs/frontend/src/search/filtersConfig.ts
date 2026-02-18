import type { GetBody } from "../types/GetType";

type RegisterBodyType = GetBody<"/auth/register", "post">;
type RegionType = RegisterBodyType['region'];
const regions: RegionType[] = ["EU", "NA", "SAM", "MENA", "OCE", "APAC", "SSA"];

export const filtersConfig = {
  searchBar: { type: "text", placeholder: "Search username" },
  region: { type: "select", options: ["", ...regions], placeholder: "All Regions" },
  availability: { type: "checkbox", label: "Availability" },
  playing: { type: "checkbox", label: "Playing" },
  alreadyFriends: { type: "checkbox", label: "Already Friends" },
  pageSize: { type: "number", placeholder: "Results per page" },
  sortBy: { type: "select", options: ["level","totalGames","totalWins","totalEnemiesKilled","totalXp","bestTime","createdAt"] },
  sortOrder: { type: "select", options: ["asc","desc"] },
  // Numeric ranges
  level: { type: "numberRange", minKey: "minLevel", maxKey: "maxLevel", label: "Level" },
  games: { type: "numberRange", minKey: "minGames", maxKey: "maxGames", label: "Games" },
  wins: { type: "numberRange", minKey: "minWins", maxKey: "maxWins", label: "Wins" },
  enemiesKilled: { type: "numberRange", minKey: "minEnemiesKilled", maxKey: "maxEnemiesKilled", label: "Enemies Killed" },
  bestTime: { type: "numberRange", minKey: "minBestTime", maxKey: "maxBestTime", label: "Best Time" },
} as const;

// Type helpers
export type FilterType = typeof filtersConfig[keyof typeof filtersConfig];
export type FilterKey = keyof typeof filtersConfig;
export type FilterConfig = typeof filtersConfig;
