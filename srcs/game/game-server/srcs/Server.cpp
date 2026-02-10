#include "Server.hpp"
Server::Server(void) : _startTime(std::chrono::steady_clock::now())
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

void	Server::removePlayer(std::string &uid, uWS::App &app)
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
						std::string topic = (*it)->getRoom().getRoomId();
						sendLeaveUpdate(*(*it).get(), app, topic);
                        // itS->sendToAll(*(*it).get());
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

void	moveMobs(std::vector<std::string> const &map, Mob &mob)
{
	float x = mob.getX();
	float y = mob.getY();

	y -= 0.1;
	if (map[y][x] == '1' || map[y][x] == 'E')
		y += 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
	y += 0.1;
	if (map[y][x] == '1' || map[y][x] == 'E')
		y -= 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
	x -= 0.1;
	if (map[y][x] == '1' || map[y][x] == 'E')
		x += 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
	x += 0.1;
	if (map[y][x] == '1' || map[y][x] == 'E')
		x -= 0.1;
	else
	{
		mob.setPos(x,y);
		return ;
	}
}

void	roomLoopUpdate(Room &room, std::vector<std::shared_ptr<Player>> &allPlayer, uWS::App *app, Server *server) {
	std::string msg = "{\"action\": \"loop_action\"";
	msg += ",\"server_timer\":" + std::to_string(server->getActualTime()) + ",\"loop\": {";
	//put player status in the msg
	const int player_size = allPlayer.size();
	if (player_size)
	{
		std::string player_update = "\"player_update\": { \"player_status\": [";
		for (const auto &player : allPlayer)
		{
			player_update += "{\"player_uid\":\"" + player->getUid() + '\"';
			player_update += ",\"player_name\":\"" + player->getName() + '\"';
			player_update += ",\"player_x\":" + std::to_string(player->getX());
			player_update += ",\"player_y\":" + std::to_string(player->getY());
			player_update += ",\"player_health\":" + std::to_string(player->getHp());
			player_update += ",\"player_anim\":" + std::to_string(player->getAnim());
			player_update += ",\"player_dir\":" + std::to_string(player->getLastDir());
			player_update += ",\"player_exit\":\"";
			player_update.push_back(player->getExit());
			player_update += "\"},";
		}
		player_update.pop_back();
		player_update.push_back(']');
		player_update.append(",\"player_num\":" + std::to_string(player_size) + '}');

		msg.append(player_update);
	}

	//put room_event status in the msg
	std::shared_ptr<ARoomEvent> event = room.getRoomEvent();
	std::vector<std::string> map = room.getRoomPlan();

	if (event && event->getType() == "MobRush")
	{
		std::string room_update;

		if (player_size)
			room_update.append(",\"room_update\": {");
		else
			room_update.append("\"room_update\": {");

		if (event->isCleared() == true)
			room_update.append("\"room_event\":\"MobRush\", \"cleared\":\"true\"");
		else
			room_update.append("\"room_event\":\"MobRush\", \"cleared\":\"false\"");
		MobRush &rush = dynamic_cast<MobRush &>(*event);
		std::unordered_map<int, std::unique_ptr<Mob>> &Mobs = rush.getMobs();
		int	amount = 0;
		const int mob_size = Mobs.size();
		if (mob_size)
		{
			std::string mobs_update = ",\"nbr_mob\":" + std::to_string(mob_size)
						+ ",\"mobs\": [";
			for (auto& [id, mob] : Mobs)
			{
				if (!mob->isDeathSend())
				{
					amount++;

					int damaged = 0;
					if (mob->isDamaged() == true)
					{
						damaged = 1;
						mob->damaged(false);
					}

					int dead = 0;
					if (mob->isDead() == true)
					{
						dead = 1;
						mob->setSendDeath(true);
					}

					// if (!damaged && !dead)
					// 	moveMobs(map, *mob);
					std::string m = "{ \"mob_id\":" + std::to_string(id)
							+ ",\"mob_x\":" + std::to_string(mob->getX())
							+ ",\"mob_y\":" + std::to_string(mob->getY())
							+ ",\"damaged\":" + std::to_string(damaged)
							+ ",\"isdead\":" + std::to_string(dead) + "},";
					mobs_update.append(m);
				}
				else
				{
					std::string m = "{ \"mob_id\":" + std::to_string(id) + ", "
							+ "\"deathsended\":" + std::to_string(1) + "},";
					mobs_update.append(m);
				}
			}
			mobs_update.pop_back();
			mobs_update.push_back(']');
			room_update.append(mobs_update);
		}
		room_update.push_back('}');
		msg.append(room_update);
	}
	else
		msg.append(", \"room_state\": {\"room_event\":\"None\"}");

	msg.append("}}");
	app->publish(room.getRoomId(), msg, uWS::OpCode::TEXT);
}

// struct TimerData
// {
// 	Server		*server;
// 	uWS::App	*app;
// };

void	Server::run(void)
{
	uWS::App app;

	struct TimerData
	{
		Server		*server;
		uWS::App	*app;
	};
	auto loop = uWS::Loop::get();
	struct us_timer_t *delayTimer = us_create_timer((struct us_loop_t *) loop, 0, sizeof(TimerData));
	auto *data = (TimerData *) us_timer_ext(delayTimer);
	data->server = this;
	data->app = &app;
	us_timer_set(delayTimer, [](struct us_timer_t *t)
	{
		auto *data = (TimerData *) us_timer_ext(t);
		for(auto session : data->server->_sessions)
		{
			std::unordered_map<Room *, std::vector<std::shared_ptr<Player>> > PlayerPerRoom;
			for (auto player : session.getPlayers())
			{
				Room &room = player->getRoomRef();
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
			for (auto i : PlayerPerRoom)
			{
				roomLoopUpdate(*i.first, i.second, data->app, data->server);
			}
		}
	}, 500, 50);

	app.ws<PerSocketData>("/*", uWS::App::WebSocketBehavior<PerSocketData> {
			.open = [](auto *ws) 
			{
				(void)ws;
				std::cout << "Client connecté\n";
			},
			.message = [this, &app](auto *ws, std::string_view msg, uWS::OpCode opCode)
			{
				(void)opCode;
				auto *data = (PerSocketData *)ws->getUserData();
				try
				{
					parseJson(data->jsonMsg, std::string(msg));
					if (!executeJson(data, ws, app))
						this->manageQueue();
				}
				catch(const std::exception& e)
				{
					std::cerr << e.what() << '\n';
					ws->send(e.what());
				}
			},
			.close = [this, &app](auto *ws, int code, std::string_view msg)
			{
				(void)ws, (void)code, (void)msg;
				auto *data = (PerSocketData *)ws->getUserData();
				this->removePlayer(data->playerId, app);
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

double Server::getActualTime(void) const
{
	return std::chrono::duration<double>(std::chrono::steady_clock::now() - this->_startTime).count();
}