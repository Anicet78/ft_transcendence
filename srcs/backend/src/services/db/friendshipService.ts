import { prisma } from './db.js';

export async function getFriends(userId: string) {
  return prisma.friendship.findMany({
    where: {
      status: 'accepted',
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    select: {
      friendshipId: true,
      status: true,
      createdAt: true,
      sender: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true,
          availability: true
        }
      },
      receiver: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true,
          availability: true
        }
      }
    }
  });
}

export async function getRequests(userId: string) {
  return prisma.friendship.findMany({
    where: {
      status: 'waiting',
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    select: {
      friendshipId: true,
      status: true,
      createdAt: true,
      sender: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true
        }
      },
      receiver: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true
        }
      }
    }
  });
}

export async function findExistingFriendship(userA: string, userB: string) {
  return prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA }
      ],
      status: { in: ['waiting', 'accepted'] }//could add rejected
    }
  });
}

export async function getFriendshipById(friendshipId: string) {
  return prisma.friendship.findUnique({
    where: { friendshipId },
    select: {
      friendshipId: true,
      senderId: true,
      receiverId: true,
      status: true
    }
  });
}

export async function sendRequest(senderId: string, receiverId: string) {
  return prisma.friendship.create({
    data: {
      senderId,
      receiverId,
      status: 'waiting'
    }
  });
}

export async function updateRequestStatus(friendshipId: string, status: string) {
  return prisma.friendship.updateMany({
    where: {
      friendshipId,
      status: 'waiting'
    },
    data: {
      status,
      updatedAt: new Date()
    }
  });
}

export async function removeFriend(userId: string, otherId: string) {
  return prisma.friendship.deleteMany({
    where: {
      status: 'accepted',
      OR: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId }
      ]
    }
  });
}
