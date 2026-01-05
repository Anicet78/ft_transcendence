#include"game_sdl.hpp"

SDL_Surface *loadOptimizedSurface(std::string path, SDL_Surface *winSurf) {
    SDL_Surface *image = SDL_LoadBMP(path.c_str());
    SDL_Surface *optimized = NULL;
    if (!image) {
        std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
        return (NULL);
    }
    else {
        optimized = SDL_ConvertSurface(image, winSurf->format, 0);
        if (!optimized) {
            std::cerr << "Image " << path << " optimization failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
        }
        SDL_FreeSurface(image);
    }
    return (optimized);
}

SDL_Surface *loadSurface(std::string path) {
    SDL_Surface *image = SDL_LoadBMP(path.c_str());
    if (!image) {
        std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
    }
    return (image);
}

bool loadMedia(SDL_Surface **keySurfaces, SDL_Surface *winSurf) {

    (void)winSurf;
    bool ret = true;

    keySurfaces[KEY_PRESS_SURFACE_DEFAULT] = loadOptimizedSurface("images/test.bmp", winSurf);
    if (!keySurfaces[KEY_PRESS_SURFACE_DEFAULT])
    {
        std::cerr << "default mdr" << std::endl;
        ret = false;
    }
    keySurfaces[KEY_PRESS_SURFACE_UP] = loadSurface("images/up.bmp");
    if (!keySurfaces[KEY_PRESS_SURFACE_UP])
    {
        std::cerr << "up mdr" << std::endl;
        ret = false;
    }
    keySurfaces[KEY_PRESS_SURFACE_LEFT] = loadSurface("images/left.bmp");
    if (!keySurfaces[KEY_PRESS_SURFACE_LEFT])
    {
        std::cerr << "left mdr" << std::endl;
        ret = false;
    }
    keySurfaces[KEY_PRESS_SURFACE_RIGHT] = loadSurface("images/right.bmp");
    if (!keySurfaces[KEY_PRESS_SURFACE_RIGHT])
    {
        std::cerr << "right mdr" << std::endl;
        ret = false;
    }
    keySurfaces[KEY_PRESS_SURFACE_DOWN] = loadSurface("images/down.bmp");
    if (!keySurfaces[KEY_PRESS_SURFACE_DOWN])
    {
        std::cerr << "down mdr" << std::endl;
        ret = false;
    }
    return (ret);
}

void    free_surfaces(SDL_Surface **surf) {

    int i = 0;
    while (i < KEY_PRESS_SURFACE_TOTAL)
        SDL_FreeSurface(surf[i++]);
    return ;
}

int	init_sdl(SDL_Window *window, SDL_Surface **keySurfaces)
{
	if (SDL_Init(SDL_INIT_VIDEO) != 0) {
		std::cerr << "SDL_Init error: " << SDL_GetError() << std::endl;
		return (0);
	}

	window = SDL_CreateWindow("Ma fenetre SDL2", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_SHOWN);
	if (!window) {
		std::cerr << "Window error: " << SDL_GetError() << std::endl;
		SDL_Quit();
		return (0);
	}

	SDL_Surface *surf = SDL_GetWindowSurface(window);

	if (loadMedia(keySurfaces, surf) == false)
		std::cerr << "BIG ERROR OMG" << std::endl;
	return (1);
}

int mainloop(SDL_Window *window, SDL_Surface **keySurfaces)
{
	SDL_Surface *surf = SDL_GetWindowSurface(window);

	bool running = true;
	SDL_Event event;
	while (running) {
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_QUIT) {
				running = false;
			}
			else if (event.type == SDL_KEYDOWN)
			{
				SDL_FillRect(surf, NULL, SDL_MapRGB(surf->format, 0xFF, 0xFF, 0xFF));
				SDL_Surface *image;
				switch (event.key.keysym.sym)
				{
					case SDLK_UP:
						image = keySurfaces[KEY_PRESS_SURFACE_UP];
						break;
					case SDLK_LEFT:
						image = keySurfaces[KEY_PRESS_SURFACE_LEFT];
						break;
					case SDLK_RIGHT:
						image = keySurfaces[KEY_PRESS_SURFACE_RIGHT];
						break;
					case SDLK_DOWN:
						image = keySurfaces[KEY_PRESS_SURFACE_DOWN];
						break;
					default:
						image = keySurfaces[KEY_PRESS_SURFACE_DEFAULT];
						break;
				}
				SDL_BlitSurface(image, NULL, surf, 0);
			}
		}
		SDL_UpdateWindowSurface(window);
	}
	return 0;
}