import type { FastifyRequest, FastifyReply } from 'fastify';
import * as profileService from '../../services/db/profileService.js';
import { type UpdateProfileBody, type ProfileIdParams, type ProfileUsernameParams} from '../../schema/profileSchema.js';
import { mapProfileToResponse, mapPublicProfileToResponse } from './profileMapper.js';
import { serializePrisma } from '../../utils/serializePrisma.js';
import { UserService } from '../../services/db/userService.js';
import fs from 'fs';
import path from 'path';

// GET /profile
export async function getProfile( req: FastifyRequest, reply: FastifyReply ) {
  const userId = req.user.id;

  const profile = await profileService.getProfile(userId);
  if (!profile) {
    return reply.code(404).send({ error: 'Profile not found' });
  }

  return reply.status(200).send(serializePrisma(mapProfileToResponse(profile)));
}

// GET /profile/:id
// export async function getPublicProfile( req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply ) {
export async function getPublicProfile(
  req: FastifyRequest<{ Params: ProfileUsernameParams }>,
  reply: FastifyReply ) {
  const userName = req.params.username;

  const profile = await profileService.getPublicProfile(userName, req.user.id);
  if (!profile) {
    return reply.code(404).send({ error: 'User not found' });
  }

  return reply.status(200).send(serializePrisma(mapPublicProfileToResponse(profile)));
}

export async function updateProfile( req: FastifyRequest<{ Body: UpdateProfileBody }>, reply: FastifyReply ) {
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
}

// DELETE /profile
export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;

  await profileService.softDeleteProfile(userId);
  return reply.status(204).send();
}

// POST /profile/:id/block
export async function blockProfile(req: FastifyRequest<{ Params: ProfileIdParams }>, reply: FastifyReply) {
  const userId: string = req.user.id;
  const targetId: string = req.params.id;

  if (userId === targetId)
    return reply.status(400).send({ error: 'Cannot block yourself' });

  if (await UserService.getUserById(targetId) == null)
    return reply.code(404).send({ error: 'User not found' });

  const lastBlockId: string | null = await profileService.getLastBlock(userId, targetId);

  if (lastBlockId)
    return reply.code(400).send({ error: 'Already blocked' });

  await profileService.blockProfile(userId, targetId);

  return reply.status(204).send();
}

// POST /profile/:id/unblock
export async function unblockProfile(req: FastifyRequest<{ Params: ProfileIdParams }>, reply: FastifyReply) {
  const userId: string = req.user.id;
  const targetId: string = req.params.id;

  if (userId === targetId)
    return reply.status(400).send({ error: 'Cannot unblock yourself' });

  if (await UserService.getUserById(targetId) == null)
    return reply.code(404).send({ error: 'User not found' });

  const lastBlockId: string | null = await profileService.getLastBlock(userId, targetId);

  if (!lastBlockId)
    return reply.code(400).send({ error: 'Not blocked' });

  await profileService.unblockProfile(lastBlockId);

  return reply.status(204).send();
}

// POST /profile/avatar

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type FilePart = {
  file: AsyncIterable<Buffer>;
  filename: string;
  mimetype: string;
};

export async function updateAvatar(req: FastifyRequest, reply: FastifyReply) {
	const userId = req.user.id;
	const parts = req.parts(); // multipart iterator
	let avatarRelativeUrl = '';

	for await (const part of parts) {
		// runtime check for file part
		if ('file' in part && 'filename' in part && 'mimetype' in part) {
		const filePart = part as unknown as FilePart;

		if (!ALLOWED_MIME_TYPES.includes(filePart.mimetype)) {
			return reply.status(400).send({ error: 'Invalid file type. Only JPEG, PNG, WEBP allowed.' });
		}

		const chunks: Buffer[] = [];
		let size = 0;
		for await (const chunk of filePart.file) {
			size += chunk.length;
			if (size > MAX_FILE_SIZE)
			return reply.status(400).send({ error: 'File too large. Max 5MB allowed.' });
			chunks.push(chunk);
		}

		// Save file
		const uploadDir = path.join('/usr/src/app', 'uploads', 'avatars');
		if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

		const fileName = `${Date.now()}-${filePart.filename}`;
		const filePath = path.join(uploadDir, fileName);
		fs.writeFileSync(filePath, Buffer.concat(chunks));

		avatarRelativeUrl = `avatars/${fileName}`; // <-- save relative path in DB
		}
	}

	if (!avatarRelativeUrl) return reply.status(400).send({ error: 'No file uploaded' });

	// Store relative path in DB
	const updatedProfile = await profileService.updateProfile(userId, { avatarUrl: avatarRelativeUrl });

	return reply.status(200).send(
		serializePrisma(mapProfileToResponse(updatedProfile))
	);
}

// Optional: serve avatars directly (already covered by fastify-static)
export async function getAvatar(req: FastifyRequest<{ Params: { filename: string } }>, reply: FastifyReply) {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);

  if (!fs.existsSync(filePath)) return reply.status(404).send({ error: 'Avatar not found' });

  return reply.sendFile(filePath);
}