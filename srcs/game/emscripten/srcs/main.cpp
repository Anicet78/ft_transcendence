#include "Game.hpp"

Engine gSdl;

#ifdef __EMSCRIPTEN__

	std::queue<val> msgJson;


	void finishGame()
	{
		SDL_EventState(SDL_KEYDOWN, SDL_DISABLE);
		SDL_EventState(SDL_KEYUP, SDL_DISABLE);
		emscripten_cancel_main_loop();
	}

	void getMessage(val obj)
	{
		msgJson.push(obj);
		if (msgJson.size() > 7)
			msgJson.pop();
	}

#endif

#ifdef __EMSCRIPTEN__
	EMSCRIPTEN_BINDINGS(module)
	{
		emscripten::function("getMessage", &getMessage);
		emscripten::function("finishGame", &finishGame);
	}
#endif

void updatePlayerState(Game &game, val msg)
{
	Player &player = game.getPlayer();
	int nbPlayers = msg["player_num"].as<int>();
	player.setPos(msg["player_x"].as<float>(), msg["player_y"].as<float>());
	player.setHp(msg["player_health"].as<int>());
	player.setAnim(msg["player_anim"].as<int>());
	if (msg.hasOwnProperty("player_exit") && msg["player_exit"].as<std::string>() != " ")
		updateRoom(game, player, msg["player_exit"].as<std::string>());
	if (nbPlayers == 1)
		game.clearOtherPlayers();
	for (int i = 1; i < nbPlayers; i++)
	{
		std::string key = "player" + std::to_string(i);
		if (!msg.hasOwnProperty(std::string(key + "_id").c_str()))
			continue; // évite undefined → std::string
		std::string uid = msg[key + "_id"].as<std::string>();
		if (!game.isInOtherPlayers(uid))
		{
			if (msg.hasOwnProperty(std::string(key + "_name").c_str()))
			{
				std::string name = msg[key + "_name"].as<std::string>();
				game.addOtherPlayer(uid, name);
			}
		}
		if (msg.hasOwnProperty(std::string(key + "_leave").c_str()))
		{
			game.suppOtherPlayer(uid);
			continue;
		}
		Player &oPlayer = game.getOtherPlayer(uid);

		if (msg.hasOwnProperty(std::string(key + "_x").c_str()))
			oPlayer.setPos(msg[key + "_x"].as<float>(), msg[key + "_y"].as<float>());
		if (msg.hasOwnProperty(std::string(key + "_health").c_str()))
			oPlayer.setHp(msg[key + "_health"].as<int>());
		if (msg.hasOwnProperty(std::string(key + "_anim").c_str()))
			oPlayer.setAnim(msg[key + "_anim"].as<int>());
		if (msg.hasOwnProperty(std::string(key + "_dir").c_str()))
			oPlayer.setDir(msg[key + "_dir"].as<int>());
	}
}

void	updateRoomState(Game &game, val msg)
{
	if (msg["room_event"].as<std::string>() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*game.getPlayer().getRoomRef().getRoomEvent());
		if (rush.isCleared() == false && msg["cleared"].as<std::string>() == "true")
			rush.setCleared(true);
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
		if (msg.hasOwnProperty(std::string("mobs").c_str()))
		{
			int nbr_mob = msg["nbr_mob"].as<int>();
			val mob = msg["mobs"];
			for (int i = 0; i < nbr_mob; i++)
			{
				val monster = mob[i];
				if (!monster.hasOwnProperty(std::string("deathsended").c_str()))
				{
					//gather all mob information from the message
					int id = monster["mob_id"].as<int>();
					float x = monster["mob_x"].as<float>();
					float y = monster["mob_y"].as<float>();

					if (monster["damaged"].as<int>() == 1)
						mobs[id]->damaged(true);
					if (monster["isdead"].as<int>() == 1)
						mobs[id]->setIsDead(true);
					mobs[id]->setPos(x, y);
				}
				else
				{
					int id = monster["mob_id"].as<int>();
					mobs[id]->setIsDead(true);
				}
			}
		}
	}
}

std::shared_ptr<ARoomEvent>	initMobRush(val &r)
{
	std::shared_ptr<ARoomEvent> event = std::make_shared<MobRush>("MobRush");
	MobRush	&rush = dynamic_cast<MobRush &>(*event);
	int nbr_mob = r["nbr_mob"].as<int>();
	if (nbr_mob != 0)
	{
		val mobs = r["mobs"];
		for (int j = 0; j < nbr_mob; j++)
		{
			val mob = mobs[j];
			int id = mob["mob_id"].as<int>();
			float x = mob["mob_x"].as<float>();
			float y = mob["mob_y"].as<float>();
			rush.addMob(id, x, y, 3);
		}
	}
	return (event);
}

void	fillMap(std::vector<Map> &maps, val &msg, std::string mapName)
{
	val mObj = msg[mapName];
	int sx = mObj["size_x"].as<int>();
	int sy = mObj["size_y"].as<int>();
	maps.emplace_back(sx, sy);
	val rooms = mObj["rooms"];
	int len = mObj["nb_rooms"].as<int>();
	for (int i = 0; i < len; i++)
	{
		val r = rooms[i];
		std::string name = r["name"].as<std::string>();
		int x = r["x"].as<int>();
		int y = r["y"].as<int>();
		int rot = r["rot"].as<int>();
		if (r.hasOwnProperty("room_event"))
		{
			std::string event_type = r["room_event"].as<std::string>();
			if (event_type == "MobRush")
			{
				auto mobrush = initMobRush(r);
				maps.back().setRoomInNode(name, x, y, rot, maps.size() - 1, mobrush);
			}
			else
				maps.back().setRoomInNode(name, x, y, rot, maps.size() - 1, NULL);
		}
		else
			maps.back().setRoomInNode(name, x, y, rot, maps.size() - 1, NULL);
	}
}

void	fillMapInfos(val &msg, Game &game)
{
	auto &vmaps = game.getMaps();
	val maps = msg["maps"];
	game.setSessionId(msg["session_id"].as<std::string>());
	fillMap(vmaps, maps, "waiting_map");
	fillMap(vmaps, maps, "floor_0");
	fillMap(vmaps, maps, "floor_1");
	vmaps[1].link(vmaps[2]);
	// printMap(vmaps[1]);
	// printMap(vmaps[2]);
}

void	launchGame(Game &game, val &msg)
{
	auto &maps = game.getMaps();
	quadList start;
	int startRoom = msg["start"].as<int>();
	for (quadList &node : maps[1].getNodes())
	{
		if (node->getRoom() && node->getRoom()->getName() == "start" && !startRoom--)
		{
			start = node;
			break ;
		}
	}
	game.getPlayer().setNode(start);
	game.setLaunched(1);
	EM_ASM_({onCppMessage({action: "launched"});});
}

void	changeRoom(Game &game, val playerLeave)
{
	std::string uid = playerLeave["player_uid"].as<std::string>();

	Player &player = game.getPlayer();
	if (player.getUid() == uid)
		updateRoom(game, player, playerLeave["player_exit"].as<std::string>());
	else
		game.suppOtherPlayer(uid);
}

void	endGame(val &msg, Game &game)
{
	Player &player = game.getPlayer();
	float	time = msg["time"].as<float>();
	int		win = msg["win"].as<int>();
	EM_ASM_({
			sendResults({
				session_id: UTF8ToString($0),
				player_id: UTF8ToString($1),
				completion_time: $2,
				is_winner: $3
			});
		}, game.getSessionId().c_str(), player.getUid().c_str(), time, win);
	finishGame();
}

void	parseJson(bool &init, Game &game)
{
	if (!msgJson.size())
		return ;

	val msg = msgJson.front();
	msgJson.pop();
	if (msg.isUndefined() || msg.isNull())
		return ;

	if (!msg.hasOwnProperty("action"))
	{
		// msgJson = val::undefined();
		return;
	}
	std::string action = msg["action"].as<std::string>();
	if (action == "waiting")
	{
		init = true;
		fillMapInfos(msg, game);
		game.getPlayer().setNode(game.getMaps()[0].getNodes()[0]);
		EM_ASM_({onCppMessage({action: "connected"});});
	}
	else if (action == "launch")
		launchGame(game, msg);
	else if (action == "loop_action")
	{
		val loop = msg["loop"];
		if (msg.hasOwnProperty("session_timer"))
			game.setTime(msg["session_timer"].as<float>());
		if (loop.hasOwnProperty("player_update"))
			loopPlayerState(game, loop["player_update"]);
		if (loop.hasOwnProperty("room_update"))
			loopRoomState(game, loop["room_update"]);
	}
	else if (action == "finished")
		endGame(msg, game);
	else if (action == "room_change")
		changeRoom(game, msg["player_leave"]);
	// msgJson = val::undefined();
}

void mainloopE(void *arg)
{
	static bool init = false;
	static double frameTime = gSdl.getActualTime();
	Game *game = static_cast<Game *>(arg);
	parseJson(init, *game);
	if (!init)
		return ;

	int	ticksPerFrame = 1000 / MAX_FPS;
	gSdl.cap.startTimer();
	while (SDL_PollEvent(&gSdl.event))
	{
		if (gSdl.event.type == SDL_KEYDOWN && gSdl.event.key.keysym.sym == SDLK_ESCAPE)
		{
			emscripten_cancel_main_loop();
			return ;
		}
		else if (gSdl.event.type == SDL_KEYDOWN)
			key_down();
		else if (gSdl.event.type == SDL_KEYUP)
			key_up();
	}
	game_loop(*game, gSdl.getActualTime() - frameTime);
	frameTime = gSdl.getActualTime();
	SDL_RenderPresent(gSdl.renderer);
	SDL_RenderClear(gSdl.renderer);
	int frameTicks = gSdl.cap.getTicks();
	if (frameTicks < ticksPerFrame)
		SDL_Delay(ticksPerFrame - frameTicks);
}

int main(int ac, char **av)
{
	srand(time(0));
	std::string name, id;
	(void)ac, (void)av;
	if (!init_sdl(gSdl))
	{
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	try
	{
		gSdl.setMapTileSize(16);
		Assets::importAssets("../assets/sprite/assets.bmp", 16);
		Assets::importAssets("../assets/sprite/forest/tiles-all.bmp", 32);
		PlayerAssets::importPlayersAssets(100);
		Mob::importMobsAssets(100);
		Room::importRooms();
		#ifdef __EMSCRIPTEN__
		id = std::to_string(rand() % 500);
		name = "guest_" + id;
		gSdl.setPlayerName(name);
		gSdl.setPlayerId(id);
		EM_ASM_({
			onCppMessage({
				action: "join_queue",
				player_name: UTF8ToString($0),
				player_id: UTF8ToString($1),
				group_size: 1
			});
		}, name.c_str(), id.c_str());
		#endif

	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
		return (0);
	}
	Player player(id, name, (SDL_Color){0, 255, 0, 255});
	Game	game(player);
	#ifdef __EMSCRIPTEN__
		emscripten_set_main_loop_arg(mainloopE, &game, MAX_FPS, true);
	#endif
	return (0);
}
