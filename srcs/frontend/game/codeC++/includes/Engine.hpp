#ifndef ENGINE_HPP
# define ENGINE_HPP

#include"game_sdl.hpp"

class Engine
{
public:
	SDL_Window		*window;
	SDL_Renderer	*renderer;
	SDL_Event		event;
	Key				key;

	Engine();
	~Engine();
};


#endif