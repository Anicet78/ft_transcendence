import Type, { type Static } from 'typebox';

//body of the sessionCreation

//format json attendu :
// {
// 	"sessionGameId": "ABCDEF15689",
// 	"startedAt": "2022-09-27T18:00:00.000+00:00",
// 	"status": "running",
// 	"playerIds" :[
// 		"id1",
// 		"id2",
// 		"id2",
// 		"id3"
// 	]
// }

export const sessionBodySchema = Type.Object({
	sessionGameId: Type.String(),
	startedAt: Type.String(),
	status: Type.String(),
	playerIds: Type.Array(
		Type.String({ format: 'uuid' })
	)
})
export type sessionBody = Static<typeof sessionBodySchema>



//body of the session end

// format json attendu :
// {
// 	"sessionGameId": "ABCDEF15689",
// 	"status": "finished" / "aborted" / ...
// }

export const sessionEndBodySchema = Type.Object({
	sessionGameId: Type.String(),
	status: Type.String()
})
export type sessionEndBody = Static<typeof sessionEndBodySchema>


//url attendu: http://localhost:3000/game/result/c936973d-5d09-489c-9e84-c04a9e6aa96b <- user_id

//body of the player result

// format json attendu :
// {
// 	"sessionGameId": "ABCDEF15689",
// 	"playerId": "id",
//	"completionTime": (int)time,
//	"ennemiesKilled": (int)nbr,
//	"isWinner": true / false,
//	"gainedXp": (int)nbr
// }

export const sessionPlayerResult = Type.Object({
	sessionGameId: Type.String(),
	playerId: Type.String({ format: 'uuid' }),
	completionTime: Type.Integer(),
	ennemiesKilled: Type.Integer(),
	isWinner: Type.Boolean(),
	gainedXp: Type.Integer(),
})
export type sessionPlayerResult = Static<typeof sessionPlayerResult>