#include "heads.hpp"

void updateRoom(Player &player)
{
	Room &room = player.getRoom();
	auto plan = room.getRoomPlan();
	float x = player.getX(), y = player.getY();

	if (room.getRoomEvent().get() && room.getRoomEvent()->isCleared() == false)
	{
		return ;
	}
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

void	player_action(Player &player, SDLTimer &cap) {
	float	timeStep = cap.getTicks() / 1000.f;
	player.setWallHitBox();
	if (gSdl.key.walking())
		player.move(timeStep);
	if (gSdl.key.attacking() && player.checkAtkState() == false)
	{
		std::cout << "je commence a attaquer" << std::endl;
		player.startAtk();
	}
	player.getBox().updateHitBox();

}

void	game_loop(Player &player, SDLTimer &cap)
{
	int tile_s = gSdl.getMapTileSize() * 2;
	updateRoom(player);

	player_action(player, cap);

	print_map(player);

	room_event(player.getRoom().getRoomEvent(), player.getCamera().getCamX(), player.getCamera().getCamY(), tile_s, player);

	print_player(player.getScreenX(), player.getScreenY(), player);

	player.getBox().printHitBox();
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
		while (SDL_PollEvent(&sdl.event))
		{
			if (sdl.event.type == SDL_QUIT)
				running = false;
			else if (sdl.event.type == SDL_KEYDOWN)
				key_down();
			else if (sdl.event.type == SDL_KEYUP)
				key_up();
		}
		game_loop(player, cap);
		// fps(frame);
		SDL_RenderPresent(sdl.renderer);
		SDL_RenderClear(gSdl.renderer);
		frame++;
		int frameTicks = cap.getTicks();
		if (frameTicks < ticksPerFrame)
			SDL_Delay(ticksPerFrame - frameTicks);
	}
	return 0;
}