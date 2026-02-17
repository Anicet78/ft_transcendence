import type { paths } from "./api"; // Ton fichier généré

export type GetBody<
	T extends keyof paths,
	M extends keyof paths[T]
> = paths[T][M] extends { requestBody?: { content: { "application/json": infer B } } }
	? B
	: never;

// 2. Pour extraire la réponse (200 OK)
export type GetResponse<
	T extends keyof paths,
	M extends keyof paths[T]
> = paths[T][M] extends { responses: { 200: { content: { "application/json": infer R } } } }
	? R
	: never;
