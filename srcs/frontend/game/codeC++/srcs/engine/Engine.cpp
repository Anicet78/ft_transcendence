#include"Engine.hpp"

Engine::Engine(void) : window(NULL), renderer(NULL) {
	return ;
}

Engine::~Engine(void) {
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	SDL_Quit();
	return ;
}