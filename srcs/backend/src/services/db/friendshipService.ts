import { prisma } from './prisma.js';

//GET FRIENDS LIST
export async function getFriends(userId: string) {
  return prisma.friendship.findMany({
    where: {
      status: 'accepted',
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ],
        AND: [
        {
          NOT: {
            OR: [
              {
                sender: {
                  usersWhoBlockedYou: {
                    some: {
                      blocker: userId,
                      deletedAt: null
                    }
                  }
                }
              },
              {
                receiver: {
                  usersWhoBlockedYou: {
                    some: {
                      blocker: userId,
                      deletedAt: null
                    }
                  }
                }
              },
              {
                sender: {
                  usersYouBlocked: {
                    some: {
                      blocked: userId,
                      deletedAt: null
                    }
                  }
                }
              },
              {
                receiver: {
                  usersYouBlocked: {
                    some: {
                      blocked: userId,
                      deletedAt: null
                    }
                  }
                }
              }
            ]
          }
        }
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

//GET PENDING FRIENDSHIP REQUEST
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

//GET FRIENDSHIP'S STATUS WITH A SPECIFIC USER
export async function getFriendshipStatus(userA: string, userB: string) {
  const friendship = await findExistingFriendship(userA, userB);

  if (!friendship) {
    return {
      status: 'none',
      friendshipId: null
    };
  }

  if (friendship.status === 'accepted') {
    return {
      status: 'friends',
      friendshipId: friendship.friendshipId
    };
  }

  if (friendship.status === 'waiting') {
    if (friendship.senderId === userA) {
      return {
        status: 'sent',
        friendshipId: friendship.friendshipId
      };
    }
    if (friendship.receiverId === userA) {
      return {
        status: 'received',
        friendshipId: friendship.friendshipId
      };
    }
  }

  return{
    status: 'none',
    friendshipId: null
  };
}

//SEND FRIENDSHIP REQUEST
export async function sendRequest(senderId: string, receiverId: string) {
  return prisma.friendship.create({
    data: {
      senderId,
      receiverId,
      status: 'waiting'
    }
  });
}

export async function updateFriendshipRequestStatus(friendshipId: string, status: string) {
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

//DELETE FRIENDSHIP
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
