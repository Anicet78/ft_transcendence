#include "Game.hpp"
#include <ctime>
#include <sys/time.h>

long	time_in_us(void)
{
	struct timeval	start;

	gettimeofday(&start, NULL);
	return (start.tv_usec);
}

void	print_player(float px, float py) {

	static int	frame = 0;
	static int	prev_state = PLAYER_IDLE;
	int			tile_s = gSdl.getMapTileSize() * 2;

	const float x = px - (0.5f * tile_s);
	const float y = py - (0.5f * tile_s);
	PlayerAssets::updateLastDir();
	if (frame >= 24)
		frame = 0;

	if (gSdl.key.attacking() == true)
	{
		if (prev_state != PLAYER_ATTACKING)
			frame = 0;
		prev_state = PLAYER_ATTACKING;
		PlayerAssets::rendPlayerAttack(0, x, y, frame / 4, 2);
	}
	else if (gSdl.key.walking() == true)
	{
		if (prev_state != PLAYER_WALKING)
			frame = 0;
		prev_state = PLAYER_WALKING;
		PlayerAssets::rendPlayerWalk(0, x, y, frame / 4, 2);
	}
	else
	{
		if (prev_state != PLAYER_IDLE)
			frame = 0;
		prev_state = PLAYER_IDLE;
		PlayerAssets::rendPlayerIdle(0, x, y, frame / 4, 2);
	}

	frame++;
}

void updateRoom(Player &player)
{
	Room room = player.getRoom();
	auto plan = room.getRoomPlan();
	float x = player.getX(), y = player.getY();

	if (plan[y][x] == 'E')
	{
		auto exitsLoc = room.getExitsLoc();

		if (exitsLoc[2][0] == static_cast<int>(x) && exitsLoc[2][1] == static_cast<int>(y)
			&& !player.getNode()->south.expired())
		{
			player.setNode(player.getNode()->south.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[0][0] + 0.5, exitsLoc[0][1] + 1);
		}
		else if (exitsLoc[0][0] == static_cast<int>(x) && exitsLoc[0][1] == static_cast<int>(y)
			&& !player.getNode()->north.expired())
		{
			player.setNode(player.getNode()->north.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[2][0] + 0.5, exitsLoc[2][1] - 0.1);
		}
		else if (exitsLoc[1][0] == static_cast<int>(x) && exitsLoc[1][1] == static_cast<int>(y)
			&& !player.getNode()->east.expired())
		{
			player.setNode(player.getNode()->east.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[3][0] + 1, exitsLoc[3][1] + 0.5);
		}
		else if (exitsLoc[3][0] == static_cast<int>(x) && exitsLoc[3][1] == static_cast<int>(y)
			&& !player.getNode()->west.expired())
		{
			player.setNode(player.getNode()->west.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[1][0] - 0.1, exitsLoc[1][1] + 0.5);
		}
	}
}

void	updatePlayerPosition(Player &player)
{
	(void)player;
	std::string msg0, msg1, msg2, msg3;
	if (gSdl.key.w_key)
		msg0 = "true";
	if (gSdl.key.a_key)
		msg1 = "true";
	if (gSdl.key.s_key)
		msg2 = "true";
	if (gSdl.key.d_key)
		msg3 = "true";
	if (!msg0.empty() || !msg1.empty() || !msg2.empty() || !msg3.empty())
	{
		EM_ASM_({
			onCppMessage({
				action: "player_move",
				w_key: UTF8ToString($0),
				a_key: UTF8ToString($1),
				s_key: UTF8ToString($2),
				d_key: UTF8ToString($3),
			});
		}, msg0.c_str(), msg1.c_str(), msg2.c_str(), msg3.c_str());

	}
}


void	game_loop(Game &game)
{
	//updateRoom(player);
	#ifdef __EMSCRIPTEN__

	updatePlayerPosition(game.getPlayer());
	#endif
	print_map(game.getPlayer(), game.getOtherPlayers());
}
