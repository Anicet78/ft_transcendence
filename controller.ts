import { FastifyRequest, FastifyReply } from 'fastify';
import * as profileModel from '../schema/profileSchema';

// GET /profile
export async function getProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const profile = await profileModel.getProfile(userId);

    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' });
    }

    return reply.send(profile);

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// PATCH /profile
export async function updateProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'username',
      'avatarUrl',
      'region',
      'availability'
    ];

    const body = req.body as Record<string, unknown>;

    // Filter only allowed fields
    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const updatedProfile = await profileModel.updateProfile(userId, updateData);

    return reply.send(updatedProfile);

  } catch (err: any) {
    req.log.error(err);

    // Prisma unique constraint error
    if (err.code === 'P2002') {
      return reply.status(409).send({
        error: 'Username or email already exists'
      });
    }

    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// DELETE /profile
export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    await profileModel.softDeleteProfile(userId);

    return reply.status(204).send();

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}
