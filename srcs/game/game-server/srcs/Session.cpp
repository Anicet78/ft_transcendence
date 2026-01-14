# include "Session.hpp"

Session::Session(void): _maxNumPlayer(5), _running(0)
{
	(void)_running;
}

Session::Session(int numPLayer): _maxNumPlayer(numPLayer), _running(0)
{}

Session::~Session(void)
{}

//-----------------------------------------------------------------

bool	Session::addPlayer(Player &newPlayer)
{
	if (this->_players.size() < static_cast<size_t>(this->_maxNumPlayer))
	{
		this->_players.push_back(newPlayer);
		return 1;
	}
	return 0;
}

bool	Session::removePlayer(Player &rmPlayer)
{
	for (size_t i = 0; i < this->_players.size(); i++)
	{
		if (this->_players[i].getUid() == rmPlayer.getUid())
		{
			this->_players.erase(this->_players.begin() + i);
			return 1;
		}
	}
	return 0;
}

int Session::getMaxNumPlayer() const
{
	return this->_maxNumPlayer;
}

int Session::getNumPlayers() const
{
	return this->_players.size();
}
