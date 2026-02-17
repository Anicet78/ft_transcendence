import { type FastifyInstance } from "fastify";
import Type from "typebox";
import * as controller from '../../controllers/game/gameController.js';
import { sessionBodySchema, sessionEndBodySchema, sessionPlayerResult } from "../../schema/gameSchema.js";

async function gameRoutes(fastify: FastifyInstance) {

	//CREATE GAME SESSION
	fastify.post("/game/create", {
		schema: {
			body: sessionBodySchema,
			response: {
				201: Type.Object({ success: Type.Boolean() })
			}
		},
		handler: controller.sessionCreationController
	});

	//END GAME SESSION
	fastify.patch("/game/end", {
		schema: {
			body: sessionEndBodySchema,
			response: {
				200: Type.Object({ success: Type.Boolean() })
			}
		},
		handler: controller.sessionEndController
	});

	//SET PLAYER RESULT
	fastify.patch("/game/result/:userId", {
		schema: {
			body: sessionPlayerResult,
			response: {
				200: Type.Object({ success: Type.Boolean() })
			}
		},
		handler: controller.sessionPlayerResultController

	})
}
export default gameRoutes;