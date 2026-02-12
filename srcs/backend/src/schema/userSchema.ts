import Type, { type Static } from 'typebox';
import { region_list } from '@prisma/client';

export const RegionSchema = Type.Enum(region_list);

export const UserSchema = Type.Object({
	id: Type.String(),
	firstname: Type.String(),
	lastname: Type.String(),
	username: Type.String(),
	region: RegionSchema,
	email: Type.String({ format: 'email' }),
	passwordHash: Type.String(),
	role: Type.String()
});

export type User = Static<typeof UserSchema>
