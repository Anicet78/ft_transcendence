#include"game_sdl.hpp"

void	print_player(void) {
	static int idle = 0;
	if (idle >= 6)
		idle = 0;
	PlayerAssets::rendPlayerWalk(0, 1 * gSdl.getMapTileSize() * 2, 1 * gSdl.getMapTileSize() * 2, idle, 2);
	idle++;
}

void	game_loop(void) {
	print_map();
	print_player();
	// key_action();
}

int mainloop(Engine &sdl)
{
	bool	running = true;
	long	frame = 0;
	while (running) {
		game_loop();
		while (SDL_PollEvent(&sdl.event)) {
			if (sdl.event.type == SDL_QUIT)
				running = false;
			else if (sdl.event.type == SDL_KEYDOWN)
				key_down();
			else if (sdl.event.type == SDL_KEYUP)
				key_up();
		}
		SDL_RenderPresent(sdl.renderer);
		SDL_RenderClear(gSdl.renderer);
		SDL_Delay(32);
		// std::cout << frame++ << std::endl;
	}
	return 0;
}