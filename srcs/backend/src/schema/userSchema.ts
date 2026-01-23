import Type, { type Static } from 'typebox';
import { Region } from '@prisma/client';

export const RegionSchema = Type.Enum(Region);

export const UserSchema = Type.Object({
	id: Type.String(),
	firstname: Type.String(),
	lastname: Type.String(),
	username: Type.String(),
	region: RegionSchema,
	email: Type.String({ format: 'email' }),
	region: Type.String(), //need to check, added to compile
	passwordHash: Type.String()
});

export type User = Static<typeof UserSchema>
