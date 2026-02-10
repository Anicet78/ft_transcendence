#include"Engine.hpp"

Engine::Engine(void) :  _tile_size(0), _startTime(std::chrono::steady_clock::now()), window(NULL), renderer(NULL), texture(NULL) {
	return ;
}

Engine::~Engine(void)
{
	SDL_DestroyTexture(texture);
	SDL_DestroyTexture(texture2);
	SDL_DestroyTexture(game);
	SDL_DestroyTexture(hud);
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	TTF_CloseFont(font);
	TTF_Quit();
	SDL_Quit();
	return ;
}

void	Engine::setPlayerId(std::string id)
{
	this->_playerId = id;
}

void	Engine::setPlayerName(std::string name)
{
	this->_playerName = name;
}

std::string Engine::getPlayerId(void) const
{
	return (this->_playerId);
}

std::string	Engine::getPlayerName(void) const
{
	return (this->_playerName);
}

void	Engine::setMapTileSize(int tile_size)
{
	_tile_size = tile_size;
	return ;
}

int		Engine::getMapTileSize(void)
{
	return (_tile_size);
}

void	Engine::setPlayerSize(int size)
{
	_player_size = size;
	return ;
}

int		Engine::getPlayerSize(void)
{
	return (_player_size);
}

SDLTimer	&Engine::getTimer(void)
{
	return (this->cap);
}

double Engine::getActualTime(void) const
{
	return std::chrono::duration<double>(std::chrono::steady_clock::now() - this->_startTime).count();
}