import type { FastifyRequest, FastifyReply } from 'fastify';
import * as friendshipSchema from '../../schema/friendshipSchema.js';

export async function getFriends(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const friends = await friendshipSchema.getFriends(userId);
  return reply.send(friends);
}

export async function getRequests(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const requests = await friendshipSchema.getRequests(userId);
  return reply.send(requests);
}

export async function sendRequest(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const senderId = req.user.id;
  const receiverId = req.params.id;

  if (senderId === receiverId)
    return reply.status(400).send({ error: 'Cannot friend yourself' });

  const result = await friendshipSchema.sendRequest(senderId, receiverId);
  return reply.status(201).send(result);
}

export async function updateRequest(
  req: FastifyRequest<{ Params: { id: string }, Body: { action: 'accept' | 'reject' } }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const otherId = req.params.id;
  const { action } = req.body;

  const result = await friendshipSchema.updateRequest(userId, otherId, action);

  if (result.count === 0)
    return reply.status(404).send({ error: 'No pending request found' });

  return reply.send({ success: true });
}

export async function removeFriend(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const otherId = req.params.id;

  const result = await friendshipSchema.removeFriend(userId, otherId);

  if (result.count === 0)
    return reply.status(404).send({ error: 'Friendship not found' });

  return reply.status(204).send();
}
