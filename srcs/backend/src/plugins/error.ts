import fp from "fastify-plugin";
import { AppError } from "../schema/errorSchema.js";
import { Prisma } from "@prisma/client";
import type { FastifyError } from "fastify";

export default fp(async (fastify) => {
	fastify.setErrorHandler((error: FastifyError | AppError | Error, request, reply) => {
	request.log.error(error);

	// AppError
	if (error instanceof AppError)
		return reply.code(error.statusCode).send({ error: error.error, message: error.message });

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

	// Prisma
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// P2002: Unique constraint failed
		if (error.code === 'P2002') {
			return reply.code(409).send({
				error: "Conflict",
				message: "Unique constraint failed"
			});
		}

		// P2025: Record not found
		if (error.code === 'P2025') {
			return reply.code(404).send({
				error: "Not Found",
				message: "Record not found"
			});
		}
	}

	// Default
	return reply.code(500).send({ error: "Internal Server Error" });
});
});
