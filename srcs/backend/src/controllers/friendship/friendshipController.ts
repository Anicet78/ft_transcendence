import type { FastifyRequest, FastifyReply } from 'fastify';
import * as Service from '../../services/db/friendshipService.js';
import {
  type SendRequestParams,
  type RemoveFriendParams
} from '../../schema/friendshipSchema.js';

function normalize<T extends Record<string, any>>(obj: T): T {
  return {
    ...obj,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt
  };
}


export async function getFriends(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const friends = await Service.getFriends(userId);

  return reply.send(friends.map(normalize));
}


export async function getRequests(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const requests = await Service.getRequests(userId);

  return reply.send(requests.map(normalize));
}


export async function sendRequest(
  req: FastifyRequest<{ Params: SendRequestParams }>,
  reply: FastifyReply
) {
  const senderId = req.user.id;
  const receiverId = req.params.id;

  if (senderId === receiverId)
    return reply.status(400).send({ error: 'Cannot befriend yourself' });

  // Prevent duplicates
  const existing = await Service.findExistingFriendship(senderId, receiverId);
  if (existing) {
    return reply.status(409).send({
      error: 'A friendship or pending request already exists'
    });
  }
  await Service.sendRequest(senderId, receiverId);
  return reply.status(201).send({ success: true });
}

//updated by friendship request ID
export async function updateRequest(
  req: FastifyRequest<{ Params: { id: string }, Body: { action: 'accept' | 'reject' | 'cancel' } }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const friendshipId = req.params.id;
  const { action } = req.body;

  //Load the friendship
  const friendship = await Service.getFriendshipById(friendshipId);

  if (!friendship || friendship.status !== 'waiting') {
    return reply.status(404).send({ error: 'No pending request found' });
  }

  const { senderId, receiverId } = friendship;

  //Check if action is allowed depending if user is sender or receiver
  if (action === 'accept' || action === 'reject') {
    if (userId !== receiverId) {
      return reply.status(403).send({ error: 'Only the receiver can accept or reject the request' });
    }
  }

  if (action === 'cancel') {
    if (userId !== senderId) {
      return reply.status(403).send({ error: 'Only the sender can cancel the request' });
    }
  }

  //Apply the update
  const newStatus =
    action === 'accept'
      ? 'accepted'
      : action === 'reject'
      ? 'rejected'
      : 'cancelled';

  await Service.updateRequestStatus(friendshipId, newStatus);

  return reply.send({ success: true });
}

//removed by friend ID
export async function removeFriend(
  req: FastifyRequest<{ Params: RemoveFriendParams }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const otherId = req.params.id;

  const result = await Service.removeFriend(userId, otherId);

  if (result.count === 0)
    return reply.status(404).send({ error: 'Friendship not found' });

  return reply.status(204).send();
}//should I leave it like that, or use friendshipId like for updateRequest ?
