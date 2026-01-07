#ifndef GAME_SDL_HPP
# define GAME_SDL_HPP

# include <iostream>
# include <SDL2/SDL.h>
# include <memory>
# include <vector>
# include <fstream>
# include "Key.hpp"
# include "Engine.hpp"
# include "Texture.hpp"

# define SCREEN_WIDTH 800
# define SCREEN_HEIGHT 600

class Engine;

enum KeyPressSurfaces {
	KEY_PRESS_SURFACE_DEFAULT,
	KEY_PRESS_SURFACE_UP,
	KEY_PRESS_SURFACE_DOWN,
	KEY_PRESS_SURFACE_LEFT,
	KEY_PRESS_SURFACE_RIGHT,
	KEY_PRESS_SURFACE_TOTAL
};

extern Engine gSdl;

int	init_sdl(Engine &gSdl);
int init_surfaces(SDL_Texture **keySurfaces, Engine &sdl);
// int mainloop(Engine &sdl, SDL_Texture **keySurfaces);
int mainloop(Engine &sdl);
SDL_Texture *loadTexture(std::string path, Engine &sdl);
bool loadMedia(SDL_Texture **keySurfaces, Engine &sdl);

#endif