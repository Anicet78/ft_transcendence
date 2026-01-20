import type { FastifyRequest, FastifyReply } from 'fastify';
import * as profileSchema from '../../schema/profileSchema.js';
import { Prisma } from '@prisma/client';

export async function getProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    const profile = await profileSchema.getProfile(userId);
    if (!profile) return reply.status(404).send({ error: 'Profile not found' });

    return reply.send(profile);

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

export async function getPublicProfile(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const userId = req.params.id;

    const profile = await profileSchema.getPublicProfile(userId);
    if (!profile) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send(profile);
  
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

export async function updateProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.id;//authenticated user's ID added by Fastify-JWT

    const allowedFields = [
      'firstName', 'lastName', 'username',
      'avatarUrl', 'region', 'availability'
    ];//is called a whitelist

    const body = req.body as Record<string, unknown>;//req.body contains JSON sent by client
    const updateData: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }//prevents client to update not allowed fields

    const updated = await profileSchema.updateProfile(userId, updateData);
    return reply.send(updated);

  } catch (err) {
    req.log.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
      return reply.status(409).send({ error: 'Username or email already exists' });
      }//Prisma error, unique constraint violation (username or email already taken)
    }
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    await profileSchema.softDeleteProfile(userId);
    return reply.status(204).send();

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}
