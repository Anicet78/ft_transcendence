import type { ProfileResponse, PublicProfileResponse } from '../../schema/profileSchema.js';

export function mapProfileToResponse(profile: any): ProfileResponse {
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
    gameProfile: { ...profile.gameProfile }
  };
}

export function mapPublicProfileToResponse(profile: any): PublicProfileResponse {
  return {
    username: profile.username,
    avatarUrl: profile.avatarUrl,
    availability: profile.availability,
    region: profile.region,
    createdAt: profile.createdAt.toISOString(),
    gameProfile: { ...profile.gameProfile }
  };
}
