import { prisma } from '../services/db/db.js';

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

export async function sendRequest(senderId: string, receiverId: string) {
  return prisma.friendship.create({
    data: {
      senderId,
      receiverId,
      status: 'waiting'
    }
  });
}

export async function updateRequest(userId: string, otherId: string, action: 'accept' | 'reject') {
  return prisma.friendship.updateMany({
    where: {
      status: 'waiting',
      receiverId: userId,
      senderId: otherId
    },
    data: {
      status: action === 'accept' ? 'accepted' : 'rejected',
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
