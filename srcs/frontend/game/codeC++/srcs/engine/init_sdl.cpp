#include"game_sdl.hpp"

int	init_sdl(Engine &gSdl)
{
	//init SDL
	if (SDL_Init(SDL_INIT_VIDEO) != 0) {
		std::cerr << "SDL_Init error: " << SDL_GetError() << std::endl;
		return (0);
	}

	//need a pointer on the window we'll create
	gSdl.window = SDL_CreateWindow("Ma fenetre SDL2", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 800, SDL_WINDOW_SHOWN);
	if (!gSdl.window) {
		std::cerr << "Window error: " << SDL_GetError() << std::endl;
		SDL_Quit();
		return (0);
	}

	//need a renderer for the texture in general
	gSdl.renderer = SDL_CreateRenderer(gSdl.window, -1, SDL_RENDERER_ACCELERATED);
	if (!gSdl.renderer)
		std::cerr << "render/20 : " << SDL_GetError() << std::endl;
	return (1);
}