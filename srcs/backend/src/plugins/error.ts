import fp from "fastify-plugin";
import http from "http";
import { AppError } from "../schema/errorSchema.js";
import { Prisma } from "@prisma/client";
import type { FastifyError } from "fastify";

const PRISMA_ERROR_MAP: Record<string, { statusCode: number, getMessage: (meta: any) => string }> = {
	P2002: {
		statusCode: 409,
		getMessage: (meta) => `Duplicate value for: ${meta?.target?.join(', ') || 'unknown field'}`
	},
	P2025: {
		statusCode: 404,
		getMessage: (meta) => meta?.cause || "Record Not Found"
	},
	P2023: {
		statusCode: 400,
		getMessage: (meta) => meta?.message || "Inconsistent column data"
	}
};

export default fp(async (fastify) => {
	fastify.setErrorHandler((error: FastifyError | AppError | Error, request, reply) => {
	request.log.error(error);

	// AppError
	if (error instanceof AppError)
		return reply.code(error.statusCode).send({ error: error.error, message: error.message });

	// Prisma
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.meta)
			error.meta.target = null;

		const mapping = PRISMA_ERROR_MAP[error.code];

		if (mapping) {
			const message = mapping.getMessage(error.meta);

			return reply.code(mapping.statusCode).send({
				error: http.STATUS_CODES[mapping.statusCode],
				message
			});
		}
	}

	// Typebox
	const fError = error as FastifyError;
	if (fError.validation) {
		const detailMessage = fError.validation
			.map(err => {
				const field = err.instancePath.replace('/', '');
				return `${field ? field + ': ' : ''}${err.message}`;
			})
			.join(', ');

		return reply.code(400).send({
			error: "Bad Request",
			message: `Validation failed: ${detailMessage}`
		});
	}

	// Fastify
	if (fError.statusCode)
		return reply.code(fError.statusCode).send({
			error: http.STATUS_CODES[fError.statusCode] || "Internal Server Error",
			message: fError.statusCode >= 500 ? "An unexpected error occurred" : error.message
		});

	// Default
	return reply.code(500).send({ error: "Internal Server Error" });
});
});
