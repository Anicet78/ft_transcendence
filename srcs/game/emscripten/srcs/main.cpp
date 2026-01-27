#include "Game.hpp"

Engine gSdl;
Map floor0(1, 1);

#ifdef __EMSCRIPTEN__

	void testIncrement(val info)
	{
		int a = info["age"].as<int>();
		a++;
		info.set("age", a);
	}

	void getMessage(val obj)
	{
		msgJson.emplace(obj);
	}

#endif

#ifdef __EMSCRIPTEN__
	EMSCRIPTEN_BINDINGS(module)
	{
		emscripten::function("getMessage", &getMessage);
		emscripten::function("testIncrement", &testIncrement);
	}
#endif

void updatePlayerState(Game &game, val &msg)
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
			continue;
		std::string uid = msg[key + "_id"].as<std::string>();
		if (!game.isInOtherPlayers(uid))
		{
			if (msg.hasOwnProperty(std::string(key + "_name").c_str()))
			{
				std::string name = msg[key + "_name"].as<std::string>();
				Player oplayer = Player(uid, name);
				game.addOtherPlayer(oplayer);
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
		maps.back().setRoomInNode(name, x, y, rot, maps.size() - 1);
	}
}

void	fillMapInfos(val &msg, Game &game)
{

	auto &vmaps = game.getMaps();
	val maps = msg["maps"];

	fillMap(vmaps, maps, "waiting_map");
	fillMap(vmaps, maps, "floor_0");
	printMap(vmaps[1]);
}

void	launchGame(Game &game)
{
	auto &maps = game.getMaps();
	quadList start;
	for (quadList &node : maps[1].getNodes())
	{
		if (node->getRoom() && node->getRoom()->getName() == "start")
		{
			start = node;
			break ;
		}
	}
	game.getPlayer().setNode(start);
	EM_ASM_({onCppMessage({action: "launched"});});
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
		return;
	if (msg["action"].as<std::string>() == "waiting")
	{
		init = true;
		fillMapInfos(msg, game);
		game.getPlayer().setNode(game.getMaps()[0].getNodes()[0]);
		EM_ASM_({onCppMessage({action: "connected"});});
	}
	else if (msg["action"].as<std::string>() == "player_state")
		updatePlayerState(game, msg);
	else if (msg["action"].as<std::string>() == "launch")
		launchGame(game);
}

void mainloopE(void)
{
	auto nodes = floor0.getNodes();
	static Player player("505", "betaTester");
	static Game	game(player);
	static bool init = false;
	parseJson(init, game);
	if (!init)
		return ;
	game_loop(game);
	while (SDL_PollEvent(&gSdl.event))
	{
		if (gSdl.event.type == SDL_KEYDOWN && gSdl.event.key.keysym.sym == SDLK_ESCAPE)
		{
			#ifdef __EMSCRIPTEN__
			emscripten_cancel_main_loop();
			#endif
			return ;
		}
		else if (gSdl.event.type == SDL_KEYDOWN)
			key_down();
		else if (gSdl.event.type == SDL_KEYUP)
			key_up();
	}
	SDL_RenderPresent(gSdl.renderer);
	SDL_RenderClear(gSdl.renderer);
}


int main(void)
{
	srand(time(0));
	if (!init_sdl(gSdl))
	{
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	try
	{
		Assets::importAssets("../assets/sprite/assets.bmp", 16);
		PlayerAssets::importPlayersAssets(100);
		Room::importRooms();
		//floor0.setWaitingRoom();
		// floor0.fillMap();
		#ifdef __EMSCRIPTEN__
		std::string id = std::to_string(rand() % 500);
		std::string name = "guest_" + id;
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
	// printMap(floor0);
	#ifdef __EMSCRIPTEN__
		emscripten_set_main_loop(mainloopE, 120, true);
	#endif
	return (0);
}
