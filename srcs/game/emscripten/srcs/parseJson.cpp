#include"Game.hpp"

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

	fillMap(vmaps, maps, "waiting_map");
	fillMap(vmaps, maps, "floor_0");
	fillMap(vmaps, maps, "floor_1");
	vmaps[1].link(vmaps[2]);
	printMap(vmaps[1]);
	printMap(vmaps[2]);
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
		if (loop.hasOwnProperty("player_update"))
			loopPlayerState(game, loop["player_update"]);
		if (loop.hasOwnProperty("room_update"))
			loopRoomState(game, loop["room_update"]);
	}
	else if (action == "room_change")
		changeRoom(game, msg["player_leave"]);
	// msgJson = val::undefined();
}