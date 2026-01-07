#ifndef ENGINE_HPP
# define ENGINE_HPP

#include"game_sdl.hpp"
#include"Map.hpp"

class Engine
{
public:
	SDL_Window		*window;
	SDL_Renderer	*renderer;
	SDL_Event		event;
	Key				key;
	Room			room;

	Engine();
	~Engine();
};


#endif