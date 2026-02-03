#include "Server.hpp"
Server::Server(void)
{}

Server::~Server(void)
{}

//-----------------------------------------------------------------

void	Server::addPlayerOnQueue(std::shared_ptr<Player> player)
{
	if (!player)
		throw std::runtime_error("the player does not exists");
	if (!player->getPartyName().empty())
	{
		for (Party &party : _matchMakingQueue)
		{
			if (!party.getPartyName().empty() && player->getPartyName() == party.getPartyName())
			{
				party.addPlayer(player);
				return ;
			}
		}
	}
	Party nParty(player->getPartyName(), player->getGroupSize());
	nParty.addPlayer(player);
	this->_matchMakingQueue.emplace_back(nParty);
}

static void addPartyMulti(std::list<Party> &matchMakingQueue, std::vector<Session> &sessions)
{
	for (auto it = matchMakingQueue.begin(); it != matchMakingQueue.end();)
	{
		Party &party = *it;

		if (party.getPartySize() == 1 || !party.isPartyFull())
		{
			++it;
			continue;
		}
		bool placed = false;
		for (Session &session : sessions)
		{
			if (!session.isRunning() && session.getPlaceLeft() >= party.getPartySize())
			{
				party.setPlayerSession();
				session.addParty(party);
				placed = true;
				break;
			}
		}
		if (!placed)
		{
			sessions.emplace_back();
			party.setPlayerSession();
			sessions.back().addParty(party);
		}
		it = matchMakingQueue.erase(it);
	}
}

static void addPartySolo(int &sumSolo, std::list<Party> &matchMakingQueue, std::vector<Session> &sessions)
{
	for (auto it = matchMakingQueue.begin(); it != matchMakingQueue.end(); )
	{
		Party &party = *it;

		if (party.getPartySize() != 1)
		{
			++it;
			continue;
		}
		bool placed = false;
		for (Session &session : sessions)
		{
			if (!session.isRunning() && session.getPlaceLeft())
			{
				party.setPlayerSession();
				session.addParty(party);
				sumSolo--;
				placed = true;
				break;
			}
		}
		if (placed)
			it = matchMakingQueue.erase(it);
		else if (sumSolo >= 2)
		{
			party.setPlayerSession();
			sessions.emplace_back();
			sessions.back().addParty(party);
			it = matchMakingQueue.erase(it);
			sumSolo--;
		}
		else
			++it;
	}
}

void	Server::manageQueue()
{
	int sumSolo = 0;

	if (this->_matchMakingQueue.empty())
		return ;
	for (Party &party : this->_matchMakingQueue)
	{
		if (party.isPartyFull() && party.getPartySize() == 1)
			sumSolo++;
	}
	addPartyMulti(this->_matchMakingQueue, this->_sessions);
	addPartySolo(sumSolo, this->_matchMakingQueue, this->_sessions);

}

void	Server::removePlayer(std::string &uid)
{
    for (auto it = _players.begin(); it != _players.end(); it++)
    {
        if (*it && it->get()->getUid() == uid)
        {
            if (it->get()->isInQueue())
            {
                for (Party &party : _matchMakingQueue)
                {
                    if (party.isPlayerInParty(uid))
                    {
                        party.removePlayer(uid);
                        if (!party.getPartySize())
                            _matchMakingQueue.remove(party);
                        else
                            party.setPartySize(party.getPartySize());
                        break ;
                    }
                }
            }
            else if (it->get()->isInSession())
            {
                for (auto itS = _sessions.begin(); itS != _sessions.end(); it++)
                {
                    if (itS->isPlayerInSession(uid))
                    {
                        itS->sendToAll(*(*it).get());
                        itS->removePlayer(*it);
                        if (itS->isRunning() && itS->getNumPlayers() < 1)
                            this->_sessions.erase(itS);
                        break ;
                    }
                }
            }
            this->_players.erase(it);
            return ;
        }
    }
}

Player	&Server::getPlayer(std::string &uid)
{
	for (auto &player : this->_players)
		if (player->getUid() == uid)
			return *player;
	return *this->_players[0];
}

struct TimerData
{
	Server	*server;
};

void	moveMobs(std::vector<std::string> const &map, Mob &mob)
{
	float x = mob.getX();
	float y = mob.getY();

	y -= 0.1;
	if (map[y][x] == '1')
		y += 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
	y += 0.1;
	if (map[y][x] == '1')
		y -= 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
	x -= 0.1;
	if (map[y][x] == '1')
		x += 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
	x += 0.1;
	if (map[y][x] == '1')
		x -= 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
}

void	roomLoopUpdate(Room &room, std::vector<std::shared_ptr<Player>> &allPlayer)
{
	(void)allPlayer;
	std::shared_ptr<ARoomEvent> event = room.getRoomEvent();
	std::vector<std::string> map = room.getRoomPlan();
	if (event && event->getType() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*event);
		std::unordered_map<int, std::unique_ptr<Mob>> &Mobs = rush.getMobs();
		for (auto& [key, value] : Mobs)
		{
			if (!value->isDead())
			{
				moveMobs(map, *value);
			}
		}
	}
}

void	Server::run(void)
{

	auto loop = uWS::Loop::get();

	struct us_timer_t *delayTimer = us_create_timer((struct us_loop_t *) loop, 0, sizeof(TimerData));
	
	auto *data = (TimerData *) us_timer_ext(delayTimer);
	data->server = this;
	us_timer_set(delayTimer, [](struct us_timer_t *t)
	{
		auto *data = (TimerData *) us_timer_ext(t);

		for(auto session : data->server->_sessions)
		{
			if (session.isRunning())
			{
				std::unordered_map<Room *, std::vector<std::shared_ptr<Player>> > PlayerPerRoom;
				for (auto player : session.getPlayers())
				{
					Room &room = player->getRoomRef();
					std::shared_ptr<ARoomEvent> event = room.getRoomEvent();
					if (room.getRoomEvent() && event->isCleared() == false)
					{
						auto i = PlayerPerRoom.find(&room);
						if (i == PlayerPerRoom.end())
						{
							std::vector<std::shared_ptr<Player>> lol;
							lol.push_back(player);
							PlayerPerRoom.emplace(&room, lol);
						}
						else
							PlayerPerRoom[i->first].push_back(player);
					}
				}
				for (auto i : PlayerPerRoom)
				{
					roomLoopUpdate(*i.first, i.second);
				}
			}
		}
	}, 1000, 1000);

	uWS::App app;
	app.ws<PerSocketData>("/*", uWS::App::WebSocketBehavior<PerSocketData> {
			.open = [](auto *ws) 
			{
				(void)ws;
				std::cout << "Client connecté\n";
			},
			.message = [this](auto *ws, std::string_view msg, uWS::OpCode opCode)
			{
				(void)opCode;
				auto *data = (PerSocketData *)ws->getUserData();
				try
				{
					parseJson(data->jsonMsg, std::string(msg));
					if (!executeJson(data, ws))
						this->manageQueue();
				}
				catch(const std::exception& e)
				{
					std::cerr << e.what() << '\n';
					ws->send(e.what());
				}
			},
			.close = [this](auto *ws, int code, std::string_view msg)
			{
				(void)ws, (void)code, (void)msg;
				auto *data = (PerSocketData *)ws->getUserData();
				this->removePlayer(data->playerId);
				std::cout << "Client déconnecté\n";
			}
		})
		.listen(3000, [](auto *token)
		{
			if (token)
			{
				std::cout << "Serveur WebSocket sur le port 3000\n";
			}
		});

		app.run();
}