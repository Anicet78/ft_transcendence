import type { FastifyRequest, FastifyReply } from 'fastify';
import * as profileService from '../../services/db/profileService.js';
// import { Prisma } from '@prisma/client';
//import { /*type UpdateProfileBody,*/ type ProfileResponse, type PublicProfileResponse} from '../../schema/profileSchema.js';
import { mapProfileToResponse, mapPublicProfileToResponse } from './profileMapper.js';
import { serializePrisma } from '../../utils/serializePrisma.js';

// GET /profile
export async function getProfile( req: FastifyRequest, reply: FastifyReply ) {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfile(userId);
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' });
    }

    // const response: ProfileResponse = mapProfileToResponse(profile);
    // return reply.send(response);
    return reply.send(serializePrisma(mapProfileToResponse(profile)));

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}


// GET /profile/:id
export async function getPublicProfile( req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply ) {
  try {
    const userId = req.params.id;

    const profile = await profileService.getPublicProfile(userId);
    if (!profile) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // const response: PublicProfileResponse = mapPublicProfileToResponse(profile);
    // return reply.send(response);
    return reply.send(serializePrisma(mapPublicProfileToResponse(profile)));

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}


// // PATCH /profile
// export async function updateProfile( req: FastifyRequest<{ Body: UpdateProfileBody }>, reply: FastifyReply ) {
//   try {
//     const userId = req.user.id;
//     const body = req.body;

// 	const allowedFields: (keyof UpdateProfileBody)[] = [
// 		'firstName', 'lastName', 'username',
// 		'avatarUrl', 'region', 'availability'
// 	];

// 	const updateData: { [K in keyof UpdateProfileBody]?: UpdateProfileBody[K] } = {};

// 	for (const key of allowedFields) {
// 		const value = body[key];
// 		if (value !== undefined) {
// 			updateData[key] = value;
// 		}
// 	}

// 	await profileService.updateProfile(userId, updateData);

//     // const updated = await profileService.updateProfile(userId, updateData);

//     // Prisma returns Date → convert to string
//     // const response: ProfileResponse = {
//     //   ...updated,
//     //   createdAt: updated.createdAt.toISOString(),
//     //   updatedAt: updated.updatedAt.toISOString()
//     // };
//     // return reply.send(response);

// 	// Fetch full profile so we return the correct TypeBox response
// 	const fullProfile = await profileService.getProfile(userId);
// 	if (!fullProfile) {
// 		return reply.status(500).send({ error: 'Profile not found after update' });
// 	}

// 	const response = mapProfileToResponse(fullProfile);
// 	return reply.send(response);

//   } catch (err) {
//     req.log.error(err);

// 	if (err instanceof Prisma.PrismaClientKnownRequestError) {
//       if (err.code === 'P2002') {
//       	return reply.status(409).send({ error: 'Username or email already exists' });
//     	}//Prisma error, unique constraint violation (username or email already taken)
//     }

//     return reply.status(500).send({ error: 'Internal server error' });
//   }
// }


// DELETE /profile
export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    await profileService.softDeleteProfile(userId);
    return reply.status(204).send();

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}
