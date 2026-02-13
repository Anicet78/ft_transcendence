#include "Game.hpp"


//Constructors/Destructors------------------------------------------------


Game::Game(Player &player): _player(player), _launched(0), _time_in_s(0)
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

float	Game::getTime() const
{
	return this->_time_in_s;
}

int		Game::getLaunched() const
{
	return this->_launched;
}

std::string const	&Game::getSessionId(void) const
{
	return this->_sessionId;
}

void	Game::setSessionId(std::string sessionId)
{
	this->_sessionId = sessionId;
}

void	Game::setLaunched(int nb)
{
	this->_launched = nb;
}

void	Game::setTime(float time)
{
	this->_time_in_s = time;
}

void	Game::clearOtherPlayers()
{
	this->_otherPlayers.clear();
}

void	Game::addOtherPlayer(std::string &uid, std::string &name)
{
	this->_otherPlayers.emplace_back(uid, name, (SDL_Color){255, 127, 0, 255});
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

void	Game::drawHud()
{
	this->_hud.print(_maps, _player, this->_launched);
	//this->_hud.printTimer(this->_time_in_s);
	std::string secM, minM, milM;
	int min = static_cast<int>(this->_time_in_s / 60);
	float sec = std::fmod(this->_time_in_s, 60);
	float mil = sec - (int)sec;
	milM = std::to_string(mil).substr(2, 2);
	secM = (sec < 10) ? '0' + std::to_string(sec).substr(0, 1) : std::to_string(sec).substr(0, 2);
	minM = (min < 10) ? '0' + std::to_string(min) : std::to_string(min);

	std::string timer = minM + ':' + secM + ':' + milM;
	SDL_Surface* surf = TTF_RenderText_Blended(gSdl.font, timer.c_str(), (SDL_Color){0, 255, 0, 255});
	if (!surf)
	{
		SDL_Log("RenderText error: %s", TTF_GetError());
		return ;
	}

	SDL_Texture *time = SDL_CreateTextureFromSurface(gSdl.renderer, surf);

	int w, h;
	SDL_QueryTexture(time, nullptr, nullptr, &w, &h);
	SDL_Rect dst = {static_cast<int>(300 - (w / 6)), static_cast<int>(75 - (h / 6)), w / 3, h / 3};
	SDL_RenderCopy(gSdl.renderer, time, nullptr, &dst);

	SDL_FreeSurface(surf);
	SDL_DestroyTexture(time);
}

bool Game::isInOtherPlayers(std::string &uid) const
{
	for (auto &player : _otherPlayers)
		if (player.getUid() == uid)
			return true;
	return false;
}