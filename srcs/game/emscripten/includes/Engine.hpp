#ifndef ENGINE_HPP
# define ENGINE_HPP

# include "Camera.hpp"

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
	Key				key;

	Engine();
	~Engine();
	void	setMapTileSize(int tile_size);
	int		getMapTileSize(void);

	void	setPlayerSize(int tile_size);
	int		getPlayerSize(void);
};

extern Engine	gSdl;

#endif