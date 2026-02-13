import type { FastifyRequest, FastifyReply } from 'fastify';
import * as Service from '../../services/db/friendshipService.js';
import {
  type SendRequestParams,
  type RemoveFriendParams
} from '../../schema/friendshipSchema.js';

import { findOrCreatePrivateChat } from '../../services/db/chat/privateChatService.js';
import { AppError } from '../../schema/errorSchema.js';

function normalize<T extends Record<string, any>>(obj: T): T {
  return {
    ...obj,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt
  };
}

//GET FRIENDS LIST
export async function getFriends(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const friends = await Service.getFriends(userId);

  return reply.send(friends.map(normalize));
}

// //GET FRIENDSHIP'S STATUS WITH A SPECIFIC USER
export async function getFriendshipStatusController(
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const otherId = req.params.userId;

  if (userId === otherId) {
    return reply.send({ 
      status: 'self',
      friendshipId: null
    });
  }

  const result = await Service.getFriendshipStatus(userId, otherId);

  return reply.send({ result });
}



//GET PENDING FRIENDSHIP REQUEST
export async function getRequests(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const requests = await Service.getRequests(userId);

  return reply.send(requests.map(normalize));
}

//SEND FRIENDSHIP REQUEST
export async function sendRequest(
  req: FastifyRequest<{ Params: SendRequestParams }>,
  reply: FastifyReply
) {
  const senderId = req.user.id;
  const receiverId = req.params.id;

  if (senderId === receiverId)
    throw new AppError('Cannot befriend yourself', 400);

  // Prevent duplicates
  const existing = await Service.findExistingFriendship(senderId, receiverId);
  if (existing)
    throw new AppError('A friendship or pending request already exists', 409);

  await Service.sendRequest(senderId, receiverId);
  return reply.status(201).send({ success: true });
}

//ACCEPT, REJECT, DELETE FRIENDSHIP REQUEST
//updated by friendship request ID
export async function updateFriendshipRequest(
  req: FastifyRequest<{ Params: { id: string }, Body: { action: 'accept' | 'reject' | 'cancel' } }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const friendshipId = req.params.id;
  const { action } = req.body;

  //Load the friendship
  const friendship = await Service.getFriendshipById(friendshipId);

  if (!friendship || friendship.status !== 'waiting')
    throw new AppError('No pending request found', 404);

  const { senderId, receiverId } = friendship;

  if (!senderId || !receiverId)
    throw new AppError('Invalid friendship data: missing at least one user IDs', 500);

  //Check if action is allowed depending if user is sender or receiver
  if (action === 'accept' || action === 'reject') {
    if (userId !== receiverId)
      throw new AppError('Only the receiver can accept or reject the request', 403);
  }

  if (action === 'cancel') {
    if (userId !== senderId)
      throw new AppError('Only the sender can cancel the request', 403);
  }

  // Create or reuse private chat
  if (action === 'accept') {
    await Service.updateFriendshipRequestStatus(friendshipId, 'accepted');
    await findOrCreatePrivateChat(senderId, receiverId);
  }


  //Apply the update
  const newStatus =
    action === 'accept'
      ? 'accepted'
      : action === 'reject'
      ? 'rejected'
      : 'cancelled';

  await Service.updateFriendshipRequestStatus(friendshipId, newStatus);

  return reply.send({ success: true });
}

//DELETE FRIENDSHIP by friend ID
export async function removeFriend(
  req: FastifyRequest<{ Params: RemoveFriendParams }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const otherId = req.params.id;

  const result = await Service.removeFriend(userId, otherId);

  if (result.count === 0)
    throw new AppError('Friendship not found', 404);

  return reply.status(204).send();
}
