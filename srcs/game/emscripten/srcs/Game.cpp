#include "Game.hpp"


//Constructors/Destructors------------------------------------------------


Game::Game(Player &player): _player(player)
{}

Game::~Game(void)
{}

//Member Functions--------------------------------------------------------


void Game::setPlayer(Player &player)
{
	this->_player = player;
}

void Game::addMap(Map &map)
{
	this->_maps.push_back(map);
}

std::vector<Map> Game::getMaps() const
{
	return this->_maps;
}

Player &Game::getPlayer()
{
	return this->_player;
}

std::vector<Player> Game::getOtherPlayers() const
{
	return this->_otherPlayers;
}

Player &Game::getOtherPlayer(std::string &uid)
{
	Player rplayer("", "");
	for (auto &player : _otherPlayers)
	{
		if (player.getUid() == uid)
		{
			rplayer = player;
			break ;
		}
	}
	return rplayer;
}

void Game::addOtherPlayer(Player &player)
{
	this->_otherPlayers.push_back(player);
}

void Game::suppOtherPlayer(std::string &uid)
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

bool Game::isInOtherPlayers(std::string &uid) const
{
	for (auto &player : _otherPlayers)
		if (player.getUid() == uid)
			return true;
	return false;
}