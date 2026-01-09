#include"game_sdl.hpp"
#include<ctime>
#include<sys/time.h>

long	time_in_us(void)
{
	struct timeval	start;

	gettimeofday(&start, NULL);
	return (start.tv_usec);
}

void	print_player(Player &player) {
	static int idle = 0;
	int	tile_s = gSdl.getMapTileSize() * 2;
	if (idle >= 6)
		idle = 0;
	PlayerAssets::rendPlayerWalk(0, (player.getX() - 0.5) * tile_s, (player.getY() - 0.5) * tile_s, idle, 2);
	idle++;
}

void updateRoom(Player &player)
{
	Room room = player.getRoom();
	auto plan = room.getRoomPlan();
	float x = player.getX(), y = player.getY();

	if (plan[y][x] == 'E')
	{
		if (y > 0 && plan[y - 1][x] == '0' && !player.getNode()->south.expired())
			player.setNode(player.getNode()->south.lock());
		else if (y < room.getHeight() - 1 && plan[y + 1][x] == '0' && !player.getNode()->north.expired())
			player.setNode(player.getNode()->north.lock());
		else if (x > 0 && plan[y][x - 1] == '0' && !player.getNode()->east.expired())
			player.setNode(player.getNode()->east.lock());
		else if (x < room.getWidth() - 1 && plan[y][x + 1] == '0' && !player.getNode()->west.expired())
			player.setNode(player.getNode()->west.lock());
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
	long uproomtime = time_in_us();
	updateRoom(player);
	long enduproomtime = time_in_us();
	std::cout << std::endl;
	std::cout << "Time in update room : " << enduproomtime - uproomtime << " us"<< std::endl;

	long upplayertime = time_in_us();
	updatePlayerPosition(player);
	//std::cout << "player pos :" << player.getX() << ", " << player.getY() << std::endl;
	long endupplayertime = time_in_us();
	std::cout << "Time in update player : " << endupplayertime - upplayertime << " us"<< std::endl;

	long printmaptime = time_in_us();
	print_map(player);
	long endprintmaptime = time_in_us();
	std::cout << "Time in print map : " << endprintmaptime - printmaptime << " us"<< std::endl;

	long printplayertime = time_in_us();
	print_player(player);
	long endprintplayertime = time_in_us();
	std::cout << "Time in print player : " << endprintplayertime - printplayertime << " us"<< std::endl;
	// key_action();


}

int mainloop(Engine &sdl, Map &floor0)
{
	bool	running = true;
	long	frame = 0;

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
	while (running) {
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
		SDL_RenderPresent(sdl.renderer);
		SDL_RenderClear(gSdl.renderer);
		SDL_Delay(16);
		// std::cout << frame++ << std::endl;
	}
	return 0;
}