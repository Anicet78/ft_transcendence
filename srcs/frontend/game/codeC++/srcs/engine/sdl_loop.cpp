#include"game_sdl.hpp"

int	init_sdl(Engine &gSdl)
{
	if (SDL_Init(SDL_INIT_VIDEO) != 0) {
		std::cerr << "SDL_Init error: " << SDL_GetError() << std::endl;
		return (0);
	}

	gSdl.window = SDL_CreateWindow("Ma fenetre SDL2", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_SHOWN);
	if (!gSdl.window) {
		std::cerr << "Window error: " << SDL_GetError() << std::endl;
		SDL_Quit();
		return (0);
	}
	gSdl.renderer = SDL_CreateRenderer(gSdl.window, -1, SDL_RENDERER_ACCELERATED);
	if (!gSdl.renderer)
		std::cerr << "render/20 : " << SDL_GetError() << std::endl;
	return (1);
}

int init_surfaces(SDL_Texture **keySurfaces, Engine &sdl)
{
	if (loadMedia(keySurfaces, sdl) == false)
	{
		std::cerr << "BIG ERROR OMG" << std::endl;
		return (0);
	}
	return (1);
}

void	key_down(void)
{
	switch(gSdl.event.key.keysym.sym)
	{
		case SDLK_w:
			gSdl.key.w_key = 1;
			break;
		case SDLK_a:
			gSdl.key.a_key = 1;
			break;
		case SDLK_s:
			gSdl.key.s_key = 1;
			break;
		case SDLK_d:
			gSdl.key.d_key = 1;
			break;
		case SDLK_SPACE:
			gSdl.key.space = 1;
			break;
	}
}

void	key_up(void)
{
	switch(gSdl.event.key.keysym.sym)
	{
		case SDLK_w:
			gSdl.key.w_key = 0;
			break;
		case SDLK_a:
			gSdl.key.a_key = 0;
			break;
		case SDLK_s:
			gSdl.key.s_key = 0;
			break;
		case SDLK_d:
			gSdl.key.d_key = 0;
			break;
		case SDLK_SPACE:
			gSdl.key.space = 0;
			break;
	}
}

void	key_action(void) {
	Key	*key = &gSdl.key;

	if (key->w_key)
		;
}

void	game_loop(void) {
	//print_map
	key_action();
}

int mainloop(Engine &sdl)
{
	// Texture	text("../images/test.bmp");
	bool	running = true;
	long	frame = 0;
	while (running) {
		game_loop();
		while (SDL_PollEvent(&sdl.event)) {
			if (sdl.event.type == SDL_QUIT)
				running = false;
			else if (sdl.event.type == SDL_KEYDOWN)
			{
				// SDL_RenderClear(gSdl.renderer);
				key_down();
				// text.render();
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