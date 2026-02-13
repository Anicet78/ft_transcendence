#include"Engine.hpp"

Engine::Engine(void) :  _tile_size(0), window(NULL), renderer(NULL), texture(NULL) {
	return ;
}

Engine::~Engine(void) {
	SDL_DestroyTexture(texture);
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	SDL_Quit();
	return ;
}

void	Engine::setMapTileSize(int tile_size) {
	_tile_size = tile_size;
	return ;
}

int		Engine::getMapTileSize(void) {
	return (_tile_size);
}

void	Engine::setPlayerSize(int size) {
	_player_size = size;
	return ;
}

int		Engine::getPlayerSize(void) {
	return (_player_size);
}