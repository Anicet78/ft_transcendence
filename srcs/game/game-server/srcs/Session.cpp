# include "Session.hpp"

Session::Session(void): _numPlayer(5), _running(0)
{
	(void)_running;
}

Session::Session(int numPLayer): _numPlayer(numPLayer), _running(0)
{}

Session::~Session(void)
{}

//-----------------------------------------------------------------

bool	Session::addPlayer(std::string &newPlayer)
{
	if (this->_players.size() < static_cast<size_t>(this->_numPlayer))
	{
		this->_players.push_back(newPlayer);
		return 1;
	}
	return 0;
}

bool	Session::removePlayer(std::string &rmPlayer)
{
	for (size_t i = 0; i < this->_players.size(); i++)
	{
		if (this->_players[i] == rmPlayer)
		{
			this->_players[i].erase();
			return 1;
		}
	}
	return 0;
}