#ifndef ENGINE_HPP
# define ENGINE_HPP

#include"game_sdl.hpp"
#include"Map.hpp"

class Engine
{
private:
	int	_tile_size;
public:
	SDL_Window		*window;
	SDL_Renderer	*renderer;
	SDL_Event		event;
	Key				key;
	Room			room;

	Engine();
	~Engine();
	void	setTileSize(int tile_size);
	int		getTileSize(void);
};


#endif