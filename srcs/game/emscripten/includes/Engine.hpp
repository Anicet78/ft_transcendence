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
		SDL_Texture		*game;
		SDL_Texture		*hud;
		SDL_Texture		*texture;
		SDL_Texture		*texture2;
		SDLTimer		cap;
		Key				key;

		Engine();
		~Engine();
		void	setMapTileSize(int tile_size);
		int		getMapTileSize(void);

		void	setPlayerSize(int tile_size);
		int		getPlayerSize(void);	

		SDLTimer	&getTimer(void);
};

extern Engine	gSdl;

#endif