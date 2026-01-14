#ifndef ENGINE_HPP
# define ENGINE_HPP

#include"game_sdl.hpp"
#include"Map.hpp"
#include"SDLTimer.hpp"

class Engine
{
private:
	int	_tile_size;
	int	_player_size;
public:
	SDL_Window		*window;
	SDL_Renderer	*renderer;
	SDL_Event		event;
	SDL_Texture		*texture;
	SDLTimer		timer;
	Key				key;
	Room			room;

	Engine();
	~Engine();
	void	setMapTileSize(int tile_size);
	int		getMapTileSize(void);

	void	setPlayerSize(int tile_size);
	int		getPlayerSize(void);
};


#endif