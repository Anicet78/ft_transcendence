#include"game_sdl.hpp"

void	print_player(void) {
	
}

void	game_loop(void) {
	print_map();
	// print_player();
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
			{
				SDL_RenderClear(gSdl.renderer);
				key_down();
				// SDL_Rect rect = {3 * 16, 0, 16, 16};
				// text.renderRect(0, 0, Texture::getRect(1));
			}
			else if (sdl.event.type == SDL_KEYUP)
			{
				// SDL_RenderClear(gSdl.renderer);
				key_up();
			}
		}
		SDL_RenderPresent(sdl.renderer);
		// std::cout << frame++ << std::endl;
	}
	return 0;
}