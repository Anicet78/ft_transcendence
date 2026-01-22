# include "Session.hpp"

Session::Session(void): _maxNumPlayer(5), _running(0), _ended(0)
{
	(void)_running;
	_maps.emplace_back(1, 1);
	_maps.back().setWaitingRoom();
	_maps.emplace_back(10, 10);
	_maps.back().fillMap();
	printMap(_maps[1]);
}

Session::Session(int numPLayer): _maxNumPlayer(numPLayer), _running(0), _ended(0)
{
	(void)_ended;

}

Session::~Session(void)
{}

//-----------------------------------------------------------------

void	Session::sendToAll(Player &sender)
{
	for (auto &player : _players)
	{
		if (sender.getUid() == player->getUid())
			continue ;
		sendPlayerState(*player, *this, sender.getUid());
	}
}

void	Session::addParty(Party &newParty)
{
	for (std::shared_ptr<Player> &player : newParty.getPlayers())
	{
		player->setNode(this->_maps[0].getNodes()[0]);
		this->_players.push_back(player);
		player->getWs()->send("{\"action\": \"waiting\"}");
		//std::cout << "avant\n";
		//usleep(300000);
		//std::cout << "apres\n";
		//sendPlayerState(*player, *this, "");
        player->getWs()->send("You have been added to a session !", uWS::OpCode::TEXT);
	}
}

bool	Session::removePlayer(std::shared_ptr<Player> rmPlayer)
{
	for (size_t i = 0; i < this->_players.size(); i++)
	{
		if (this->_players[i]->getUid() == rmPlayer->getUid())
		{
			this->_players.erase(this->_players.begin() + i);
			return 1;
		}
	}
	return 0;
}

std::vector<std::shared_ptr<Player>> Session::getPlayers() const
{
	return this->_players;
}

std::shared_ptr<Player> &Session::getPlayer(std::string &uid)
{
	for (auto &player : _players)
	{
		if (player->getUid() == uid)
		{
			return player;
			break ;
		}
	}
	return _players[0];
}

int Session::getMaxNumPlayer() const
{
	return this->_maxNumPlayer;
}

int Session::getPlaceLeft() const
{
	return this->_maxNumPlayer - this->_players.size();
}

int Session::getNumPlayers() const
{
	return this->_players.size();
}

bool Session::hasEnded() const
{
	return this->_ended;
}

bool Session::isRunning() const
{
	return this->_running;
}

bool Session::isPlayerInSession(std::string &uid) const
{
	for (auto &player : _players)
		if (player->getUid() == uid)
			return true;
	return false;
}
