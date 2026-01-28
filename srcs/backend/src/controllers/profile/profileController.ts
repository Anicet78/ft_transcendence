import type { FastifyRequest, FastifyReply } from 'fastify';
import * as profileService from '../../services/db/profileService.js';
import { Prisma } from '@prisma/client';
import { type UpdateProfileBody, type ProfileIdParams} from '../../schema/profileSchema.js';
import { mapProfileToResponse, mapPublicProfileToResponse } from './profileMapper.js';
import { serializePrisma } from '../../utils/serializePrisma.js';
import { UserService } from '../../services/db/userService.js';

// GET /profile
export async function getProfile( req: FastifyRequest, reply: FastifyReply ) {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfile(userId);
    if (!profile) {
      return reply.code(404).send({ error: 'Profile not found' });
    }

    return reply.status(200).send(serializePrisma(mapProfileToResponse(profile)));

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}


// GET /profile/:id
// export async function getPublicProfile( req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply ) {
export async function getPublicProfile(
  req: FastifyRequest<{ Params: ProfileIdParams }>,
  reply: FastifyReply ) {
  try {
    const userId = req.params.id;

    const profile = await profileService.getPublicProfile(userId);
    if (!profile) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return reply.status(200).send(serializePrisma(mapPublicProfileToResponse(profile)));

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function updateProfile( req: FastifyRequest<{ Body: UpdateProfileBody }>, reply: FastifyReply ) {
  try {
    const userId = req.user.id;

    //Specify which fields can be updated
    const allowedFields = new Set([
      'firstName', 'lastName', 'username', 'avatarUrl', 'region', 'availability'
    ]);

    const bodyFields = Object.keys(req.body);
    const forbidden = bodyFields.filter(key => !allowedFields.has(key));

    if (forbidden.length > 0) {
      return reply.code(400).send({ error: `Forbidden field(s): ${forbidden.join(', ')}`});
    }

    //if allowed, update profile
    const updated = await profileService.updateProfile(userId, req.body);

    return reply.status(200).send(serializePrisma(mapProfileToResponse(updated)));

  } catch (err) {
    req.log.error(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
      	return reply.code(409).send({ error: 'Username or email already exists' });
    	}//Prisma error code, unique constraint violation (username or email already taken)
    }
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

// DELETE /profile
export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    await profileService.softDeleteProfile(userId);
    return reply.status(204).send();

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

// POST /profile/:id/block
export async function blockProfile(req: FastifyRequest<{ Params: ProfileIdParams }>, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    if (await UserService.getUserById(req.params.id) == null)
      return reply.code(404).send({ error: 'User not found' });

    await profileService.blockProfile(userId, req.params.id);
  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }

  return reply.status(204).send();
}

// POST /profile/:id/unblock
export async function unblockProfile(req: FastifyRequest<{ Params: ProfileIdParams }>, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    if (await UserService.getUserById(req.params.id) == null)
      return reply.code(404).send({ error: 'User not found' });

    const lastBlockId: string | null = await profileService.getLastBlock(userId, req.params.id);

    if (!lastBlockId)
      return reply.code(400).send({ error: 'Not blocked' });

    await profileService.unblockProfile(lastBlockId);

    return reply.status(204).send();
  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}
