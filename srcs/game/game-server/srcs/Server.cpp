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
	if (!player->getPartyId().empty())
	{
		for (Party &party : _matchMakingQueue)
		{
			if (!party.getPartyId().empty() && player->getPartyId() == party.getPartyId())
			{
				party.addPlayer(player);
				return ;
			}
		}
	}
	Party nParty(player->getPartyId(), player->getGroupSize(), player->getSessionSize());
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
			if (!session.isRunning() && session.getPlaceLeft() >= party.getPartySize() && session.getMaxNumPlayer() == party.getSessionSize())
			{
				party.setPlayerSession();
				session.addParty(party);
				placed = true;
				break;
			}
		}
		if (!placed)
		{
			sessions.emplace_back(party.getSessionSize());
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
			if (!session.isRunning() && session.getPlaceLeft() && session.getMaxNumPlayer() == party.getSessionSize())
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
		else if (sumSolo >= 1)
		{
			party.setPlayerSession();
			sessions.emplace_back(party.getSessionSize());
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

bool	Server::playerInServer(std::string uid)
{
	for (auto player : this->_players)
	{
		if (player->getUid() == uid)
			return 1;
	}
	return 0;
}

void	Server::reconnectPlayer(std::string &uid, uWS::WebSocket<false, true, PerSocketData> *ws)
{
	for (auto &player : this->_players)
	{
		if (player->getUid() != uid)
			continue ;
		if (player->isInQueue() || !player->isInSession())
			return ;
		player->setWs(ws);
		for (auto &session : this->_sessions)
		{
			if (!session.isPlayerInSession(uid))
				continue ;
			std::string msg;
			if (!session.isRunning())
				msg = session.sendMaps();
			else
			{
				msg = session.sendMaps();
				msg.replace(12, 7, "reconnect");
				msg.pop_back();
				msg += ", \"player_floor\":" + std::to_string(player->getFloor())
					+ ", \"map_x\" : " + std::to_string(player->getNode()->getX())
					+ ", \"map_y\" : " + std::to_string(player->getNode()->getY())
					+ ", \"room_x\" : " + std::to_string(player->getX()) 
					+ ", \"room_y\" : " + std::to_string(player->getY()) + '}';
			}
			ws->send("You have been reconnected to a session !", uWS::OpCode::TEXT);
			ws->send(msg, uWS::OpCode::TEXT);
			return ;
		}
	}
}

void Server::removePlayer(std::string uid)
{
    for (auto it = _players.begin(); it != _players.end(); )
    {
        if (!*it)
		{
            it = _players.erase(it);
            continue;
        }

		if (it == _players.end())
			break ;

        if ((*it)->getUid() == uid)
            it = _players.erase(it);
		else
            ++it;
    }
}

std::vector<Session>::iterator	Server::endSession(std::string sessionId, uWS::App &app)
{
	for (auto it = this->_sessions.begin(); it != this->_sessions.end(); it++)
	{
		if (it->getSessionId() != sessionId)
			continue ;
		for (auto &p : it->getPlayers())
		{
			if (p.expired())
				continue ;
			std::shared_ptr<Player> player = p.lock();
			if (!player->getFinished())
				(*it).sendEndResults(app, player, 1);
			this->removePlayer(p.lock()->getUid());
		}
		return this->_sessions.erase(it);
	}
	return this->_sessions.end();
}

Player	&Server::getPlayer(std::string &uid)
{
	for (auto &player : this->_players)
		if (player->getUid() == uid)
			return *player;
	return *this->_players[0];
}

std::weak_ptr<Player> findClosestPlayer(std::vector<std::weak_ptr<Player>> &allPlayer, Mob &mob)
{
	float dis = 2147483647.f;
	int pos = 0;
	for (size_t i = 0; i < allPlayer.size(); i++)
	{
		if (allPlayer[i].expired())
			continue ;
		Player &p = *allPlayer[i].lock();
		float nDist = dist(p.getX(), p.getY(), mob);
		if (nDist < dis)
		{
			dis = nDist;
			pos = i;
		}
	}
	return allPlayer[pos];
}

void	roomLoopUpdate(Room &room, std::vector<std::weak_ptr<Player>> &allPlayer, uWS::App *app, Session &session, int const &isRunning)
{
	std::string msg = "{\"action\": \"loop_action\"";

	msg += ",\"session_timer\":" + std::to_string(session.getActualTime());
	msg += ",\"running\":" + std::to_string(isRunning) + ",\"loop\": {";

	const int player_size = allPlayer.size();
	if (player_size)
	{
		std::string player_update = "\"player_update\": { \"player_status\": [";
		for (const auto &p : allPlayer)
		{
			if (p.expired())
				continue ;
			std::shared_ptr<Player> player = p.lock();
			player_update += "{\"player_uid\":\"" + player->getUid() + '\"';
			player_update += ",\"player_name\":\"" + player->getName() + '\"';
			player_update += ",\"player_x\":" + std::to_string(player->getX());
			player_update += ",\"player_y\":" + std::to_string(player->getY());
			player_update += ",\"player_health\":" + std::to_string(player->getHp());
			player_update += ",\"player_anim\":" + std::to_string(player->getAnim());
			player_update += ",\"player_dir\":" + std::to_string(player->getLastDir());
			player_update += ",\"player_kills\":" + std::to_string(player->getKills());
			player_update += ",\"player_start\":" + std::to_string(player->getStartPos());
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
		const int mob_size = Mobs.size();
		if (mob_size)
		{
			std::string mobs_update = ",\"nbr_mob\":" + std::to_string(mob_size)
						+ ",\"mobs\": [";
			for (auto &[id, mob] : Mobs)
			{
				if (!mob->isDeathSend())
				{
					int damaged = 0;
					if (mob->isDamaged() == true)
					{
						damaged = 1;
						mob->setState(MOB_HURT);
						mob->damaged(false);
					}

					int dead = 0;
					if (mob->isDead() == true)
					{
						dead = 1;
						mob->setSendDeath(true);
					}
					else
					{
						std::weak_ptr<Player> player = findClosestPlayer(allPlayer, *mob);
						if (player_size && !player.expired())
							mob->MobAction(player.lock()->getX(), player.lock()->getY(), map);
						else
							mob->MobAction(-1, -1, map);
					}
					int mobAnim = 0;
					if (mob->getRoutine() == MOB_CHASING)
					{
						if (mob->getState() != MOB_HURT)
							mobAnim = MOB_WALKING;
						else
							mobAnim = mob->getState();
					}
					else
					{
						if (mob->getState() != MOB_CHASE_LAST)
							mobAnim = mob->getState();
						else
							mobAnim = MOB_WALKING;
					}
					std::string m = "{ \"mob_id\":" + std::to_string(id)
							+ ",\"mob_x\":" + std::to_string(mob->getX())
							+ ",\"mob_y\":" + std::to_string(mob->getY())
							+ ",\"last_dir\":" + std::to_string(mob->getLastDir())
							+ ",\"mob_anim\":" + std::to_string(mobAnim)
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

		for(auto &session : data->server->_sessions)
		{
			if (!session.isRunning() && session.isReadyToRun())
			{
				if (session.isEnoughtReadyTime())
					session.launch();
				continue;
			}
			session.checkFinishedPlayers(*data->app);
			if (session.hasEnded())
			{
				std::cout << "ended" << std::endl;
				continue ;
			}
			std::unordered_map<Room *, std::vector<std::weak_ptr<Player>> > PlayerPerRoom;
			for (auto p : session.getPlayers())
			{
				if (p.expired())
					continue ;
				if (p.lock()->getFinished())
					continue ;
				Room &room = p.lock()->getRoomRef();
				auto i = PlayerPerRoom.find(&room);
				if (i == PlayerPerRoom.end())
				{
					std::vector<std::weak_ptr<Player>> lol;
					lol.push_back(p);
					PlayerPerRoom.emplace(&room, lol);
				}
				else
					PlayerPerRoom[i->first].push_back(p);
			}
			for (auto i : PlayerPerRoom)
				roomLoopUpdate(*i.first, i.second, data->app, session, session.isRunning());
		}

		for (auto it = data->server->_players.begin(); it != data->server->_players.end();) // loop to erase players whose has deconnected for more than 7 sec
		{
			if (!(*it)->isReConnected() && (*it)->getTimeDeconnection() > 7.f)
			{
				for (auto &session : data->server->_sessions)
				{
					if (session.isPlayerInSession((*it)->getUid()))
					{
						session.removePlayer((*it)->getUid());
						break;
					}
				}
				it = data->server->_players.erase(it);
			}
			if (it != data->server->_players.end())
				it++;
		}
		
		for (auto it = data->server->_sessions.begin(); it != data->server->_sessions.end();) // loop to end sessions which has no (active) players in it
		{
			if (it->hasEnded())
				it = data->server->endSession(it->getSessionId(), *data->app);
			if (it != data->server->_sessions.end())
				it++;
		}
	}, 500, 50);

	app.ws<PerSocketData>("/*", uWS::App::WebSocketBehavior<PerSocketData> {
			.open = [](auto *ws)
			{
				(void)ws;
				std::cout << "Client connecté" << std::endl;
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
					std::cerr << e.what() << std::endl;
					ws->send(e.what(), uWS::OpCode::TEXT);
				}
			},
			.close = [this, &app](auto *ws, int code, std::string_view msg)
			{
				(void)ws, (void)code, (void)msg, (void)app;
				auto *data = (PerSocketData *)ws->getUserData();
				Player &player = this->getPlayer(data->playerId);
				player.setReconnexion(0);
				if (player.getFinished())
					this->removePlayer(data->playerId);
				std::cout << "Client déconnecté" << std::endl;
			}
		})
		.listen(4444, [](auto *token)
		{
			if (token)
			{
				std::cout << "Serveur WebSocket sur le port 4444" << std::endl;
			}
		});

		app.run();
}