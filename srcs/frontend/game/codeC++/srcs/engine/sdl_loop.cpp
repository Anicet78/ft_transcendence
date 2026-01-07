#include"game_sdl.hpp"

void    free_surfaces(SDL_Surface **surf) {

    int i = 0;
    while (i < KEY_PRESS_SURFACE_TOTAL)
        SDL_FreeSurface(surf[i++]);
    return ;
}

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
	std::cout << "down" << std::endl;
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
	std::cout << "up" << std::endl;
}

int mainloop(Engine &sdl)
{
	bool	running = true;
	long	frame = 0;
	while (running) {
		while (SDL_PollEvent(&sdl.event)) {
			if (sdl.event.type == SDL_QUIT)
				running = false;
			else if (sdl.event.type == SDL_KEYDOWN)
				key_down();
			else if (sdl.event.type == SDL_KEYUP)
				key_up();
		}
		SDL_RenderClear(gSdl.renderer);
		SDL_RenderPresent(sdl.renderer);
		// std::cout << frame++ << std::endl;
	}
	return 0;
}

// int mainloop(Engine &sdl, SDL_Texture **keyTextures)
// {
// 	Texture	text("../images/test.bmp");
// 	bool	running = true;
// 	long	frame = 0;
// 	while (running) {
// 		while (SDL_PollEvent(&sdl.event)) {
// 			if (sdl.event.type == SDL_QUIT) {
// 				running = false;
// 			}
// 			else if (sdl.event.type == SDL_KEYDOWN)
// 			{

// 				SDL_Texture *texture;
// 				SDL_RenderClear(sdl.renderer);
// 				SDL_SetRenderDrawColor(sdl.renderer, 30, 30, 60, 255);
// 				std::cout << "kekw" << std::endl;
// 				switch (sdl.event.key.keysym.sym)
// 				{
// 					case SDLK_UP:
// 						texture = keyTextures[KEY_PRESS_SURFACE_UP];
// 						break;
// 					case SDLK_LEFT:
// 						texture = keyTextures[KEY_PRESS_SURFACE_LEFT];
// 						break;
// 					case SDLK_RIGHT:
// 						texture = keyTextures[KEY_PRESS_SURFACE_RIGHT];
// 						break;
// 					case SDLK_DOWN:
// 						texture = keyTextures[KEY_PRESS_SURFACE_DOWN];
// 						break;
// 					default:
// 						SDL_Rect rect = {1000, 500, 500, 500};
// 						text.renderRect(0, 0, &rect);
// 						// texture = text.getTexture()/*keyTextures[KEY_PRESS_SURFACE_DEFAULT]*/;
// 						break;
// 				}
// 				SDL_RenderCopy(sdl.renderer, texture, NULL, NULL);
// 			}
// 			else if (sdl.event.type == SDL_KEYUP)
// 				std::cout << "feur" << std::endl;
// 		}
// 		// SDL_Rect fillRect = { SCREEN_WIDTH / 4, SCREEN_HEIGHT / 4, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 };
// 		// SDL_SetRenderDrawColor(sdl.renderer, 0xFF, 0x00, 0x00, 0xFF);
// 		// SDL_RenderFillRect(sdl.renderer, &fillRect);
// 		// SDL_Rect outlineRect = { SCREEN_WIDTH / 6, SCREEN_HEIGHT / 6, SCREEN_WIDTH * 2 / 3, SCREEN_HEIGHT * 2 / 3 };
// 		// SDL_SetRenderDrawColor(sdl.renderer, 0x00, 0xFF, 0x00, 0xFF);
// 		// SDL_RenderDrawRect(sdl.renderer, &outlineRect);
// 		// SDL_Rect feur = { 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2};
// 		// SDL_RenderSetViewport(sdl.renderer, &feur);
// 		// SDL_RenderCopy(sdl.renderer, keyTextures[KEY_PRESS_SURFACE_UP], NULL, NULL);
// 		// SDL_RenderSetViewport(sdl.renderer, NULL);
// 		SDL_RenderPresent(sdl.renderer);
// 		std::cout << frame++ << std::endl;
// 	}
// 	return 0;
// }