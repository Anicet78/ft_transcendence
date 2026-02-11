#ifndef ENGINE_HPP
# define ENGINE_HPP

# include "Camera.hpp"

class Engine
{
	private:
		int	_tile_size;
		int	_player_size;
		std::string	_playerId;
		std::string	_playerName;
		const std::chrono::steady_clock::time_point	_startTime;
		bool		_isRunning;

	public:
		SDL_Window		*window;
		SDL_Renderer	*renderer;
		SDL_Event		event;
		SDL_Texture		*game;
		SDL_Texture		*hud;
		SDL_Texture		*texture;
		SDL_Texture		*texture2;
		TTF_Font		*font;
		SDLTimer		cap;
		SDLTimer		timer;
		Key				key;

		Engine();
		~Engine();

		void	setPlayerId(std::string id);
		void	setPlayerName(std::string name);

		std::string	getPlayerId(void) const;
		std::string	getPlayerName(void) const;
		void	setMapTileSize(int tile_size);
		int		getMapTileSize(void);

		void	setPlayerSize(int tile_size);
		int		getPlayerSize(void);

		double	getActualTime(void) const;

		bool	getIsRunning(void) const;
		void	enableIsRunning(void);
		void	disableIsRunning(void);

		SDLTimer	&getTimer(void);
};

extern Engine	gSdl;

#endif