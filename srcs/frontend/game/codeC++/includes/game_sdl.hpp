#ifndef GAME_SDL_HPP
# define GAME_SDL_HPP

# include <iostream>
# include <SDL2/SDL.h>
# include <memory>
# include <vector>
# include <map>
# include <fstream>
# include <exception>
# include "Key.hpp"
# include "Engine.hpp"
# include "Texture.hpp"
# include "Assets.hpp"
# include "Player.hpp"

# define SCREEN_WIDTH 800
# define SCREEN_HEIGHT 600

class Engine;

extern Engine gSdl;

int	init_sdl(Engine &gSdl);
int mainloop(Engine &sdl);
SDL_Texture *loadTexture(std::string path, Engine &sdl);

void	key_down(void);
void	key_up(void);
void	key_action(void);

void	print_map(void);
void	manage_wall(int x, int y);
int		check_tile(int x, int y);

#endif