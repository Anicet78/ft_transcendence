# include "Session.hpp"

Session::Session(void): _maxNumPlayer(2), _running(0), _ended(0)
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

void	Session::launch()
{
	quadList start, vide;
	this->_running = true;
	for (quadList &node : this->_maps[1].getNodes())
	{
		if (node->getRoom() && node->getRoom()->getName() == "start")
		{
			start = node;
			break ;
		}
	}
	for (auto &player : this->_players)
	{
		player->setNode(start);
		player->getWs()->send("{\"action\": \"launch\"}");
	}
}

void	Session::sendToAll(Player &sender)
{
	for (auto &player : _players)
	{
		if (sender.getUid() == player->getUid())
			continue ;
		sendPlayerState(*player, *this, sender.getUid());
	}
}

void	putRoomEvent(std::string &msg, std::shared_ptr<Room> room)
{
	msg += ", \"room_event\": \"" + room->getRoomEvent()->getType() + '\"';
	if (room->getRoomEvent()->getType() == "MobRush")
	{
		MobRush &event = dynamic_cast<MobRush &>(*room->getRoomEvent());
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = event.getMobs();
		if (mobs.size())
		{
			msg += ", \"nbr_mob\": " + std::to_string(mobs.size());
			msg += ", \"mobs\": [";
			for (auto it = mobs.begin(); it != mobs.end(); ++it)
			{
				Mob	&mob = *it->second;
				msg += "{\"mob_id\": " + std::to_string(it->first) + ", "
					+ "\"mob_x\": " + std::to_string(mob.getX()) + ", "
					+ "\"mob_y\": " + std::to_string(mob.getY()) + "},";
			}
			if (*msg.rbegin() == ',')
				msg.pop_back();
			msg += "]";
		}
	}
}

std::string	Session::sendMaps(void)
{
	if (!this->_mapInfos.empty())
		return this->_mapInfos;

	std::string msg = "{\"action\": \"waiting\", \"maps\": { ";
	for (size_t i = 0; i < this->_maps.size(); i++)
	{
		if (!i)
			msg += "\"waiting_map\": { ";
		else
			msg += ", \"floor_" + std::to_string(i - 1) + "\": { ";
		msg += "\"size_x\": " + std::to_string(this->_maps[i].getWidth()) + ", "
			+ "\"size_y\": " + std::to_string(this->_maps[i].getHeight()) + ", "
			+ "\"rooms\": [";
		int j = 0;
		for (quadList &node : this->_maps[i].getNodes())
		{
			if (!node->getRoom())
				continue ;
			auto room = node->getRoom();
			if (j)
				msg += ", ";
			msg += "{\"name\": \"" + room->getName() + "\", "
				+ "\"x\": " + std::to_string(node->getX()) + ", "
				+ "\"y\": " + std::to_string(node->getY()) + ", "
				+ "\"rot\": " + std::to_string(room->getRotated());
			if (room->getRoomEvent())
			{
				putRoomEvent(msg, room);
			}
			msg += '}';
			j++;
		}
		msg += "], \"nb_rooms\": " + std::to_string(j) + "}";
	}
	msg += "}}";
	this->_mapInfos = msg;
	return this->_mapInfos;
}

void	Session::addParty(Party &newParty)
{
	std::string msg;
	for (std::shared_ptr<Player> &player : newParty.getPlayers())
	{
		player->setNode(this->_maps[0].getNodes()[0]);
		this->_players.push_back(player);
		msg = this->sendMaps();
		player->getWs()->send(msg);
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

bool Session::doesAllPlayersConnected() const
{
	for (auto &player : this->_players)
		if (!player->isConnected())
			return false;
	return true;
}

bool Session::isPlayerInSession(std::string &uid) const
{
	for (auto &player : _players)
		if (player->getUid() == uid)
			return true;
	return false;
}
