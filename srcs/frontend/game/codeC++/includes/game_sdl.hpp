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
# include "PlayerAssets.hpp"

# define SCREEN_WIDTH 800
# define SCREEN_HEIGHT 800

class Engine;
class Player;

enum state
{
	PLAYER_IDLE,
	PLAYER_WALKING,
	PLAYER_ATTACKING
};


extern Engine gSdl;

int	init_sdl(Engine &gSdl);
int mainloop(Engine &sdl, Map &floor0);
SDL_Texture *loadTexture(std::string path, Engine &sdl);

void	key_down(void);
void	key_up(void);
void	key_action(void);

void	manage_wall(float x, float y);
int		check_tile(int x, int y);
void	print_player(float px, float py);

#endif