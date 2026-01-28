import { prisma } from './prisma.js';
import { Prisma } from '@prisma/client';

export const profileSelect = Prisma.validator<Prisma.AppUserSelect>()({
  appUserId: true,
  firstName: true,
  lastName: true,
  username: true,
  mail: true,
  avatarUrl: true,
  availability: true,
  region: true,
  createdAt: true,
  updatedAt: true,
  lastConnectedAt: true,
  gameProfile: {
    select: {
      totalGames: true,
      totalWins: true,
      totalLoses: true,
      totalEnemiesKilled: true,
      totalXp: true,
      level: true,
      bestTime: true
    }
  }
});
export type PrismaProfile = Prisma.AppUserGetPayload<{ select: typeof profileSelect }>;

// Access authenticated user's to its own profile
//rename with getPublicProfile
export async function getProfile(userId: string) {
  return prisma.appUser.findUnique({
    where: { appUserId: userId },
    select: profileSelect
    // select: {
    //   appUserId: true,
    //   firstName: true,
    //   lastName: true,
    //   username: true,
    //   mail: true,
    //   avatarUrl: true,
    //   availability: true,
    //   region: true,
    //   createdAt: true,
    //   updatedAt: true,
    //   lastConnectedAt: true,
    //   // I included game profile, we can separate the process if wanted
    //   gameProfile: {
    // 	select: {
    // 	  totalGames: true,
    // 	  totalWins: true,
    // 	  totalLoses: true,
    // 	  totalEnemiesKilled: true,
    // 	  totalXp: true,
    // 	  level: true,
    // 	  bestTime: true,
    // 	}
    //   }
    // }
  });
}

// Retrieve another user's public profile
//rename with getPublicProfileById
export async function getPublicProfile(userId: string) {
  return prisma.appUser.findUnique({
    where: { appUserId: userId },
    select: profileSelect
    // select: {
    //   username: true,
    //   avatarUrl: true,
    //   availability: true,
    //   region: true,
    //   createdAt: true,
    //   gameProfile: {
    // 	select: {
    // 	  totalGames: true,
    // 	  totalWins: true,
    // 	  totalLoses: true,
    // 	  totalEnemiesKilled: true,
    // 	  totalXp: true,
    // 	  level: true,
    // 	  bestTime: true,
    // 	}
    //   }
    // }
  });
}

// Update user's own profile
export async function updateProfile(userId: string, data: Record<string, unknown>) {
  return prisma.appUser.update({
    where: { appUserId: userId },
    data: {
      ...data,
      updatedAt: new Date()
    },
    select: profileSelect
    // select: {
    //   appUserId: true,
    //   firstName: true,
    //   lastName: true,
    //   username: true,
    //   mail: true,
    //   avatarUrl: true,
    //   availability: true,
    //   region: true,
    //   updatedAt: true
    // }
  });
}

// Soft-delete the user: anonymize but keep rows for FK integrity
export async function softDeleteProfile(userId: string) {
  // Generate anonymized values
  const anonymizedUsername = `deleted_${userId}`;
  const anonymizedEmail = `deleted_${userId}@example.com`;

  return prisma.appUser.update({
    where: { appUserId: userId },
    data: {
      username: anonymizedUsername,
      mail: anonymizedEmail,
      firstName: 'Deleted',
      lastName: 'Deleted',
      avatarUrl: null,
      region: 'Deleted',
      availability: false,
      deletedAt: new Date(),
      updatedAt: new Date(),
    }
  });
}

export async function blockProfile(userId: string, targetId: string) {
  return prisma.blocked_list.create({
    data: {
      blocker: userId,
      blocked: targetId,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
}

export async function getLastBlock(userId: string, targetId: string): Promise<string | null> {
  const lastblock: { blocked_list: string, deleted_at: Date | null } | null = await prisma.blocked_list.findFirst({
    where: {
      blocker: userId,
      blocked: targetId,
        deleted_at: null
    },
    orderBy: { created_at: 'desc' },
    select: {
      blocked_list: true,
      deleted_at: true
    }
  });
  if (!lastblock || lastblock.deleted_at == null)
    return null;
  return lastblock.blocked_list;
}

export async function unblockProfile(lastBlockId: string) {
  return prisma.blocked_list.update({
    where: { blocked_list: lastBlockId },
    data: {
      deleted_at: new Date()
    }
  });
}
