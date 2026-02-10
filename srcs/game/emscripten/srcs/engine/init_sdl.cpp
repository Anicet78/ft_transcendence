#include"Game.hpp"

int	init_sdl(Engine &gSdl)
{
	//init SDL
	
	if (SDL_Init(SDL_INIT_VIDEO) != 0) {
		std::cerr << "SDL_Init error: " << SDL_GetError() << std::endl;
		return (0);
	}

	//need a pointer on the window we'll create
	gSdl.window = SDL_CreateWindow("Game", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, SCREEN_WIDTH, SCREEN_HEIGHT, SDL_WINDOW_SHOWN);
	if (!gSdl.window) {
		std::cerr << "Window error: " << SDL_GetError() << std::endl;
		SDL_Quit();
		return (0);
	}

	if(TTF_Init() == -1 )
	{
		return false;
	}

	gSdl.font = TTF_OpenFont("assets/fonts/Pixeloid_Font/PixeloidMono.ttf", 32);
	if (!gSdl.font)
	{
		SDL_Log("TTF_OpenFont error: %s", TTF_GetError());
		return false;
	}

	//need a renderer for the texture in general
	gSdl.renderer = SDL_CreateRenderer(gSdl.window, -1, SDL_RENDERER_ACCELERATED);
	if (!gSdl.renderer) {
		std::cerr << "render/20 : " << SDL_GetError() << std::endl;
		SDL_DestroyWindow(gSdl.window);
		SDL_Quit();
		return (0);
	}

	if (!gSdl.timer.getStarted())
		gSdl.timer.startTimer();
	if (gSdl.game == NULL)
		gSdl.game = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, SCREEN_WIDTH * 16, GAME_HEIGHT * 16);
	if (gSdl.hud == NULL)
		gSdl.hud = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, SCREEN_WIDTH, (SCREEN_HEIGHT - GAME_HEIGHT));

	SDL_EventState(SDL_KEYDOWN, SDL_ENABLE);
	SDL_EventState(SDL_KEYUP, SDL_ENABLE);
	
	return (1);
}