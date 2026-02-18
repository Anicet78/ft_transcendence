import type { PrismaProfile, PrismaPublicProfile } from '../../services/db/profileService.js';
import type { ProfileResponse, PublicProfileResponse } from '../../schema/profileSchema.js';

export function mapProfileToResponse(profile: PrismaProfile): ProfileResponse {
  return {
    appUserId: profile.appUserId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    mail: profile.mail,
    avatarUrl: profile.avatarUrl,
    availability: profile.availability,
    region: profile.region,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    lastConnectedAt: profile.lastConnectedAt.toISOString(),
    // gameProfile: { ...profile.gameProfile }
    gameProfile: profile.gameProfile
    ? {
      level: profile.gameProfile.level,
      totalGames: profile.gameProfile.totalGames,
      totalWins: profile.gameProfile.totalWins,
      totalLoses: profile.gameProfile.totalLoses,
      totalEnemiesKilled: profile.gameProfile.totalEnemiesKilled,
      totalXp: profile.gameProfile.totalXp,
      bestTime: profile.gameProfile.bestTime
    }
    : null
  };
}

export function mapPublicProfileToResponse(profile: PrismaPublicProfile): PublicProfileResponse {
  return {
    appUserId: profile.appUserId,
    username: profile.username,
    avatarUrl: profile.avatarUrl,
    availability: profile.availability,
    playing: profile.playing,
    region: profile.region,
    blocked: profile.usersWhoBlockedYou.length >= 1 ? true : false,
    createdAt: profile.createdAt.toISOString(),
    gameProfile: profile.gameProfile
    ? {
      level: profile.gameProfile.level,
      totalGames: profile.gameProfile.totalGames,
      totalWins: profile.gameProfile.totalWins,
      totalLoses: profile.gameProfile.totalLoses,
      totalEnemiesKilled: profile.gameProfile.totalEnemiesKilled,
      totalXp: profile.gameProfile.totalXp,
      bestTime: profile.gameProfile.bestTime
    }
    : null
    // gameProfile: { ...profile.gameProfile }
  };
}
