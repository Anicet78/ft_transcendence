#include"Engine.hpp"

Engine::Engine(void) :  _tile_size(0), window(NULL), renderer(NULL), texture(NULL) {
	return ;
}

Engine::~Engine(void) {
	SDL_DestroyTexture(texture);
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
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

void	Engine::setMapTileSize(int tile_size) {
	_tile_size = tile_size;
	return ;
}

int		Engine::getMapTileSize(void) {
	return (_tile_size);
}

void	Engine::setPlayerSize(int size)
{
	_player_size = size;
	return ;
}

int		Engine::getPlayerSize(void) {
	return (_player_size);
}

SDLTimer	&Engine::getTimer(void) {
	return (this->cap);
}