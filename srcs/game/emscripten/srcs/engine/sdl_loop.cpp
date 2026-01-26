#include "Game.hpp"
#include <ctime>
#include <sys/time.h>

void updateRoom(Game &game, Player &player, std::string dir)
{
	Room room = player.getRoom();
	auto plan = room.getRoomPlan();

	auto exitsLoc = room.getExitsLoc();

	if (dir == "S")
	{
		game.clearOtherPlayers();
		player.setNode(player.getNode()->south.lock());
		exitsLoc = player.getRoom().getExitsLoc();
		player.setPos(exitsLoc[0][0] + 0.5, exitsLoc[0][1] + 1);
	}
	else if (dir == "N")
	{
		game.clearOtherPlayers();
		player.setNode(player.getNode()->north.lock());
		exitsLoc = player.getRoom().getExitsLoc();
		player.setPos(exitsLoc[2][0] + 0.5, exitsLoc[2][1] - 0.1);
	}
	else if (dir == "E")
	{
		game.clearOtherPlayers();
		player.setNode(player.getNode()->east.lock());
		exitsLoc = player.getRoom().getExitsLoc();
		player.setPos(exitsLoc[3][0] + 1, exitsLoc[3][1] + 0.5);
	}
	else if (dir == "W")
	{
		game.clearOtherPlayers();
		player.setNode(player.getNode()->west.lock());
		exitsLoc = player.getRoom().getExitsLoc();
		player.setPos(exitsLoc[1][0] - 0.1, exitsLoc[1][1] + 0.5);
	}
}

void	updatePlayerPosition(Player &player)
{
	static int isIdling = 1;
	std::string w_key, a_key, s_key, d_key, anim = "idling", lastDir;
	if (gSdl.key.w_key)
		w_key = "true";
	if (gSdl.key.a_key)
		a_key = "true";
	if (gSdl.key.s_key)
		s_key = "true";
	if (gSdl.key.d_key)
		d_key = "true";
	if (gSdl.key.space)
		anim = "attacking";
	else if (gSdl.key.w_key || gSdl.key.a_key || gSdl.key.s_key || gSdl.key.d_key)
		anim = "walking";
	player.updateLastDir();
	lastDir = std::to_string(player.getLastDir());
	if (!w_key.empty() || !a_key.empty() || !s_key.empty() || !d_key.empty() || anim != "idling")
	{
		EM_ASM_({
			onCppMessage({
				action: "player_move",
				w_key: UTF8ToString($0),
				a_key: UTF8ToString($1),
				s_key: UTF8ToString($2),
				d_key: UTF8ToString($3),
				anim: UTF8ToString($4),
				last_dir: UTF8ToString($5)
			});
		}, w_key.c_str(), a_key.c_str(), s_key.c_str(), d_key.c_str(), anim.c_str(), lastDir.c_str());
		isIdling = 0;
	}
	else if (!isIdling)
	{
		isIdling = 1;
		EM_ASM_({
			onCppMessage({
				action: "player_move",
				w_key: UTF8ToString($0),
				a_key: UTF8ToString($1),
				s_key: UTF8ToString($2),
				d_key: UTF8ToString($3),
				anim: UTF8ToString($4),
				last_dir: UTF8ToString($5)
			});
		}, w_key.c_str(), a_key.c_str(), s_key.c_str(), d_key.c_str(), anim.c_str(), lastDir.c_str());
	}
}

static void print_mobs(MobRush &mobRush, Player &player)
{
	int		tile_s = gSdl.getMapTileSize() * 2;
	Camera	&cam = player.getCamera();
	for (auto &mob : mobRush.getMobs())
		mob.second->printMob(cam.getCamY(), cam.getCamY(), tile_s);
}

void	game_loop(Game &game)
{
	Player	&player = game.getPlayer();
	//updateRoom(player);
	#ifdef __EMSCRIPTEN__

	updatePlayerPosition(game.getPlayer());
	#endif
	print_map(player);
	if (player.getRoom().getRoomEvent())
	{
		MobRush &mobrush = dynamic_cast<MobRush &>(*player.getRoom().getRoomEvent());
		print_mobs(mobrush, player);
	}
	print_others(player, game.getOtherPlayers());
	player.printPlayer(player.getScreenX(), player.getScreenY());
}
