#include "game_sdl.hpp"
#include<ctime>
#include<sys/time.h>

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
	Room room = player.getRoom();
	float x = player.getX(), y = player.getY();
	auto plan = room.getRoomPlan();
	if (gSdl.key.w_key)
	{
		y -= 0.1;
		if (y >= 0 && plan[y][x] != '1')
			player.setPos(x, y);
		else
			y += 0.1;
	}
	if (gSdl.key.a_key)
	{
		x -= 0.1;
		if (x >= 0 && plan[y][x] != '1')
			player.setPos(x, y);
		else
			x += 0.1;
	}
	if (gSdl.key.s_key)
	{
		y += 0.1;
		if (y < room.getHeight() && plan[y][x] != '1')
			player.setPos(x, y);
		else
			y -= 0.1;
	}
	if (gSdl.key.d_key)
	{
		x += 0.1;
		if (x < room.getWidth() && plan[y][x] != '1')
			player.setPos(x, y);
		else
			x -= 0.1;
	}
}

void	game_loop(Player &player)
{
	updateRoom(player);
	updatePlayerPosition(player);
	print_map(player);
}

void	fps(Uint32 frame) {
	float 	fps = frame / (gSdl.timer.getTicks() / 1000.f);
	if (fps > 2000000)
		fps = 0;
	std::cout << fps << std::endl;
	return ;
}

int mainloop(Engine &sdl, Map &floor0)
{
	bool	running = true;

	auto nodes = floor0.getNodes();
	quadList start;
	for (auto &node : nodes)
	{
		if (node->getRoom() && node->getRoom()->getName() == "start")
		{
			start = node;
			break ;
		}
	}

	Player player(505, "betaTester", start);
	SDLTimer	cap;

	Uint32 frame = 0;
	int	ticksPerFrame = 1000 / MAX_FPS;
	while (running)
	{
		cap.startTimer();
		game_loop(player);
		while (SDL_PollEvent(&sdl.event))
		{
			if (sdl.event.type == SDL_QUIT)
				running = false;
			else if (sdl.event.type == SDL_KEYDOWN)
				key_down();
			else if (sdl.event.type == SDL_KEYUP)
				key_up();
		}
		fps(frame);
		SDL_RenderPresent(sdl.renderer);
		SDL_RenderClear(gSdl.renderer);
		frame++;
		int frameTicks = cap.getTicks();
		if (frameTicks < ticksPerFrame)
			SDL_Delay(ticksPerFrame - frameTicks);
	}
	return 0;
}