import Type, { type Static } from 'typebox';

export const GlobalHeadersSchema = Type.Object({
	"x-socket-id": Type.String({ minLength: 10 })
});

export type GlobalHeaders = Static<typeof GlobalHeadersSchema>
