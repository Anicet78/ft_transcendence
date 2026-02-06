#include "Game.hpp"


//Constructors/Destructors------------------------------------------------


Game::Game(Player &player): _player(player), _launched(0)
{}

Game::~Game(void)
{}

//Member Functions--------------------------------------------------------


void Game::addMap(Map &map)
{
	this->_maps.push_back(map);
}

std::vector<Map> &Game::getMaps()
{
	return this->_maps;
}

Player &Game::getPlayer()
{
	return this->_player;
}

std::vector<Player> &Game::getOtherPlayers()
{
	return this->_otherPlayers;
}

Player &Game::getOtherPlayer(std::string &uid)
{
	for (auto &player : _otherPlayers)
	{
		if (player.getUid() == uid)
		{
			return player;
			break ;
		}
	}
	return _otherPlayers[0];
}

int		Game::getLaunched() const
{
	return this->_launched;
}

void	Game::setLaunched(int nb)
{
	this->_launched = nb;
}

void	Game::clearOtherPlayers()
{
	this->_otherPlayers.clear();
}

void	Game::addOtherPlayer(std::string &uid, std::string &name)
{
	this->_otherPlayers.emplace_back(uid, name, (SDL_Color){255, 127, 0, 255});
}

void	Game::suppOtherPlayer(std::string &uid)
{
	for (auto it = this->_otherPlayers.begin(); it != this->_otherPlayers.end(); it++)
	{
		if (it->getUid() == uid)
		{
			this->_otherPlayers.erase(it);
			return ;
		}
	}
}

void	Game::drawHud()
{
	this->_hud.print(_maps, _player, this->_launched);
}

bool Game::isInOtherPlayers(std::string &uid) const
{
	for (auto &player : _otherPlayers)
		if (player.getUid() == uid)
			return true;
	return false;
}