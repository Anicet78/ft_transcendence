#include"Engine.hpp"

Engine::Engine(void) :  _tile_size(0), window(NULL), renderer(NULL), texture(NULL) {
	return ;
}

Engine::~Engine(void)
{
	SDL_DestroyTexture(texture);
	SDL_DestroyTexture(texture2);
	SDL_DestroyTexture(game);
	SDL_DestroyTexture(hud);
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	TTF_CloseFont(font);
	TTF_Quit();
	SDL_Quit();
	return ;
}

void	Engine::setMapTileSize(int tile_size)
{
	_tile_size = tile_size;
	return ;
}

int		Engine::getMapTileSize(void)
{
	return (_tile_size);
}

void	Engine::setPlayerSize(int size)
{
	_player_size = size;
	return ;
}

int		Engine::getPlayerSize(void)
{
	return (_player_size);
}

SDLTimer	&Engine::getTimer(void)
{
	return (this->cap);
}