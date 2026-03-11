#include"Game.hpp"

int	init_sdl(Engine &gSdl)
{
	//init SDL

	if (SDL_Init(SDL_INIT_VIDEO) != 0)
	{
		std::cout << "SDL_Init : " << SDL_GetError() << std::endl;
		return (0);
	}
	int n = SDL_GetNumRenderDrivers();
	for (int i = 0; i < n; i++)
	{
		SDL_RendererInfo	openInfo;
		SDL_GetRenderDriverInfo(i, &openInfo);
		std::string name(openInfo.name);
		if (name == "opengles2")
		{	
			n = i;
			break;
		}
	}

	//need a pointer on the window we'll create
	if (!gSdl.window)
		gSdl.window = SDL_CreateWindow("Game", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, SCREEN_WIDTH, SCREEN_HEIGHT, SDL_WINDOW_SHOWN);
	if (!gSdl.window)
	{
		std::cout << "Window : " << SDL_GetError() << std::endl;
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
		SDL_DestroyWindow(gSdl.window);
		SDL_Quit();
		SDL_Log("TTF_OpenFont : %s", TTF_GetError());
		return false;
	}

	//need a renderer for the texture in general
	if (!gSdl.renderer)
		gSdl.renderer = SDL_CreateRenderer(gSdl.window, n, SDL_RENDERER_ACCELERATED);
	if (!gSdl.renderer) {
		std::cout << "Render could not be created because of WebGl, please restart your web browser." << std::endl;
		SDL_DestroyWindow(gSdl.window);
		SDL_Quit();
		return (0);
	}

	SDL_RendererInfo info;
    SDL_GetRendererInfo(gSdl.renderer, &info);
	if (info.max_texture_width > 16384)
	{
		gSdl.maxTexWidth = info.max_texture_width / 2;
		gSdl.maxTexHeight = info.max_texture_height / 2;
	}
	else
	{
		gSdl.maxTexWidth = info.max_texture_width;
		gSdl.maxTexHeight = info.max_texture_height;
	}

	if (!gSdl.timer.getStarted())
		gSdl.timer.startTimer();
	if (gSdl.game == NULL)
		gSdl.game = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, gSdl.maxTexWidth, gSdl.maxTexHeight);
	if (gSdl.hud == NULL)
		gSdl.hud = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, SCREEN_WIDTH, (SCREEN_HEIGHT - GAME_HEIGHT));

	SDL_EventState(SDL_KEYDOWN, SDL_ENABLE);
	SDL_EventState(SDL_KEYUP, SDL_ENABLE);
	
	return (1);
}