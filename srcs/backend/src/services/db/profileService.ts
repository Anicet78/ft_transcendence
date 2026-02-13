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
  playing: true,
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
  });
}

// Retrieve another user's public profile
//rename with getPublicProfileById
export async function getPublicProfile(userName: string) {
  return prisma.appUser.findUnique({
    where: { username:  userName},
    select: profileSelect
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

export async function getLastBlock(userId: string, targetId: string): Promise<string | null> {
  const lastblock: { blockedListId: string, deletedAt: Date | null } | null =
    await prisma.blockedList.findFirst({
    where: {
      blocker: userId,
      blocked: targetId,
        deletedAt: null
    },
    orderBy: { createdAt: 'desc' },
    select: {
      blockedListId: true,
      deletedAt: true
    }
  });
  if (!lastblock || lastblock.deletedAt !== null)
    return null;
  return lastblock.blockedListId;
}

export async function blockProfile(userId: string, targetId: string) {
  return prisma.blockedList.create({
    data: {
      blocker: userId,
      blocked: targetId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

export async function unblockProfile(lastBlockId: string) {
  return prisma.blockedList.update({
    where: { blockedListId: lastBlockId },
    data: {
      updatedAt: new Date(),
      deletedAt: new Date()
    }
  });
}


// export async function getLastBlock(
//   userId: string,
//   targetId: string
// ): Promise<string | null> {
//   const lastblock = await prisma.blockedList.findFirst({
//     where: {
//       blocker: userId,
//       blocked: targetId,
//       deletedAt: null
//     },
//     orderBy: {
//       createdAt: 'desc'
//     },
//     select: {
//       blockedListId: true
//     }
//   });

//   return lastblock?.blockedListId ?? null;
// }
