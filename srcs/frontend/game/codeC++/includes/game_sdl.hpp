#ifndef GAME_SDL_HPP
# define GAME_SDL_HPP

# include <iostream>
# include <SDL2/SDL.h>
# include <memory>
# include <vector>
# include <fstream>

enum KeyPressSurfaces {
	KEY_PRESS_SURFACE_DEFAULT,
	KEY_PRESS_SURFACE_UP,
	KEY_PRESS_SURFACE_DOWN,
	KEY_PRESS_SURFACE_LEFT,
	KEY_PRESS_SURFACE_RIGHT,
	KEY_PRESS_SURFACE_TOTAL
};

int	init_sdl(SDL_Window *window, SDL_Surface **keySurfaces);
int mainloop(SDL_Window *window, SDL_Surface **keySurfaces);

#endif