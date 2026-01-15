#ifndef HEADS_HPP
# define HEADS_HPP

# include "Player.hpp"

enum state
{
	PLAYER_IDLE,
	PLAYER_WALKING,
	PLAYER_ATTACKING
};

int	init_sdl(Engine &gSdl);
int mainloop(Engine &sdl, Map &floor0);
SDL_Texture *loadTexture(std::string path, Engine &sdl);

void	key_down(void);
void	key_up(void);
void	key_action(void);

void	print_player(float px, float py);
void	print_map(Player &player);

#endif