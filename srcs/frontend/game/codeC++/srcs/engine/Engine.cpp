#include"Engine.hpp"

Engine::Engine(void) : window(NULL), renderer(NULL), _tile_size(0) {
	return ;
}

Engine::~Engine(void) {
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	SDL_Quit();
	return ;
}

void	Engine::setTileSize(int tile_size) {
	_tile_size = tile_size;
	return ;
}

int		Engine::getTileSize(void) {
	return (_tile_size);
}