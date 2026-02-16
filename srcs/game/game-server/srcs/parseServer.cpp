# include "Server.hpp"

void Server::parseJson(std::map<std::string, std::string> &res, std::string msg)
{
	if (msg[0] != '{' || msg.empty())
	   throw std::runtime_error("Json imput invalid syntax");
		
	std::istringstream stream(msg);
	std::string buffer;

	while (std::getline(stream, buffer, ','))
	{
		buffer.erase(0, buffer.find_first_not_of(" \n\r\t{"));
		buffer.erase(buffer.find_last_not_of(" \n\r\t}") + 1);

		if (buffer.empty())
			continue ;
		size_t pos1, pos2;
		if ((pos1 = buffer.find('\"')) == std::string::npos)
			throw std::runtime_error(std::string("Json input invalid syntax near \"") + buffer[0] + '\"');
		if ((pos2 = buffer.find("\":")) == std::string::npos)
			throw std::runtime_error(std::string("Json input invalid syntax near \"") + buffer[pos1 + 1] + '\"');
		pos1++;
		std::string key = buffer.substr(pos1, pos2 - pos1);
		std::string value;
		pos1 = pos2 + 2;
		if ((pos1 = buffer.find('\"', pos1)) == std::string::npos)
		{
			pos1 = pos2 + 2;
			if (isdigit(buffer[pos1]))
				value = buffer.substr(pos1);
			else
				throw std::runtime_error(std::string("Json input invalid syntax near \"") + key + buffer[pos1] + '\"');
		}
		else if ((pos2 = buffer.find('\"', pos1 + 1)) == std::string::npos)
			throw std::runtime_error(std::string("Json input invalid syntax near \"") + key + buffer[pos1] + buffer[pos1 + 1] + '\"');
		else
		{
			pos1++;
			value = buffer.substr(pos1, pos2 - pos1);
		}
		res.emplace(key, value);
	}

}

void	sendRoomState(Player &player, std::string &msg)
{
	std::shared_ptr<ARoomEvent> const event = player.getRoom().getRoomEvent();
	//if there is no event in the current room
	if (!event)
	{
		msg += ", \"room_state\": {\"room_event\":\"None\"}";
		return ;
	}
	//if the event is a MobRush
	else if (event && event->getType() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*player.getRoomRef().getRoomEvent());
		std::string cleared = "false";

		//check if the actual event is cleared
		if (rush.isCleared() == true)
			cleared = "true";
		msg += ", \"room_state\": {\"room_event\":\"MobRush\", \"cleared\":\"" + cleared + "\"";
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
		if (mobs.size() != 0)
		{
			int	nbrMob = 0;
			msg += ", \"mobs\":[";
			for (auto& [key, value] : mobs) {

				nbrMob++;
				//check if the mobs already send the message saying he's dead
				if (value->isDeathSend() == false)
				{
					int	damg = 0;
					//check if the mobs took damage
					if (value->isDamaged() == true)
					{
						damg = 1;
						value->damaged(false);
					}
					//check if the mobs id dead
					int dea = 0;
					if (value->isDead() == true)
					{
						dea = 1;
						//set the flag for death message sended to true
						value->setSendDeath(true);
					}

					msg += "{ \"mob_id\":" + std::to_string(key) + ", "
					+ "\"mob_x\":" + std::to_string(value->getX()) + ", "
					+ "\"mob_y\":" + std::to_string(value->getY()) + ", "
					+ "\"damaged\":" + std::to_string(damg) + ", "
					+ "\"isdead\":" + std::to_string(dea) + "},";
				}
				else
				{
					msg += "{ \"mob_id\":" + std::to_string(key) + ", "
					+ "\"deathsended\":" + std::to_string(1) + "},";
				}
			}
			if (*msg.rbegin() == ',')
				msg.pop_back();
			msg += "],";
			msg += "\"nbr_mob\":" + std::to_string(nbrMob);
		}
		msg += '}';
	}
}

void sendPlayerState(Player &player, Session &session, std::string uid_leave)
{
	std::string msg =   "{ \"action\" : \"update\", \"player_state\": { \"player_x\" : " + std::to_string(player.getX()) + ", "
						+ "\"player_y\" : " + std::to_string(player.getY()) + ", "
						+ "\"player_health\" : " + std::to_string(player.getHp()) + ", "
						+ "\"player_anim\" : " + std::to_string(player.getAnim()) + ", "
						+ "\"player_exit\" : \"" + player.getExit() + "\"";
		
	int sumPlayer = 1;
	for (auto &op : session.getPlayers())
	{
		if (op.expired())
			continue ;
		std::shared_ptr<Player> oplayer = op.lock();
		if (oplayer->getUid() == player.getUid())
			continue ;
		if (oplayer->getNode() == player.getNode() || (oplayer->getPrevNode() == player.getNode() && oplayer->getExit() > 32))
		{
			msg += ", \"player" + std::to_string(sumPlayer) + "_x\" : " + std::to_string(oplayer->getX()) + ", "
					+ "\"player" + std::to_string(sumPlayer) + "_y\" : " + std::to_string(oplayer->getY()) + ", "
					+ "\"player" + std::to_string(sumPlayer) + "_id\" : \"" + oplayer->getUid() + "\", "
					+ "\"player" + std::to_string(sumPlayer) + "_name\" : \"" + oplayer->getName() + "\", "
					+ "\"player" + std::to_string(sumPlayer) + "_health\" : " + std::to_string(oplayer->getHp()) + ", "
					+ "\"player" + std::to_string(sumPlayer) + "_anim\" : " + std::to_string(oplayer->getAnim()) + ", "
					+ "\"player" + std::to_string(sumPlayer) + "_dir\" : " + std::to_string(oplayer->getLastDir()) + ", "
					+ "\"player" + std::to_string(sumPlayer) + "_exit\" : \"" + oplayer->getExit() + "\"";
			if ((!uid_leave.empty() && uid_leave == oplayer->getUid()) || oplayer->getExit() > 32)
				msg += ", \"player" + std::to_string(sumPlayer) + "_leave\" : \"true\"";
			sumPlayer++;
		}
	}
	msg += ", \"player_num\" : " + std::to_string(sumPlayer) + "}";

	sendRoomState(player, msg);

	msg += '}';

	player.getWs()->send(msg);
}

int Server::executeJson(PerSocketData *data, uWS::WebSocket<false, true, PerSocketData> *ws, uWS::App &app)
{
	std::map<std::string, std::string> &req = data->jsonMsg;

	std::string &action = req["action"];
	if (action == "join_queue")
	{
		data->pseudo = req["player_name"];
        data->playerId = req["player_id"];
        data->groupId = req["group_id"];
        data->groupSize = std::atoi(req["group_size"].c_str());
		data->sessionSize = std::atoi(req["session_size"].c_str());
		if (this->playerInServer(data->playerId))
		{
			this->reconnectPlayer(data->playerId, ws);
			Player &player = this->getPlayer(data->playerId);
			player.setConnexion(1);
			data->jsonMsg.clear();
			return 1;
		}
        ws->send("You have been added in the queue !", uWS::OpCode::TEXT);
        this->_players.emplace_back(std::make_shared<Player>(data->playerId, data->groupSize, data->groupId, data->pseudo, data->sessionSize, ws));
        this->addPlayerOnQueue(_players.back());
        data->jsonMsg.clear();
        return 0;
    }
	else if (action == "reconnected")
		ws->subscribe(this->getPlayer(data->playerId).getRoomRef().getRoomId());
    else if (action == "player_move" || action == "connected" || action == "launched")
    {
        for (Session &session : _sessions)
        {
            if (session.isPlayerInSession(ws->getUserData()->playerId))
            {
                std::shared_ptr<Player> player = session.getPlayer(ws->getUserData()->playerId).lock();
                if (action == "connected")
                    player->setConnexion(1);
                else if (action == "launched")
                    player->setLaunched(1);
                else if (action == "player_move")
                {
                    updatePlayer(*player, req);
                    updateRoom(*player, app);
					updateWorld(*player);
                }
                if (!session.getPlaceLeft() && session.doesAllPlayersConnected() && !session.isReadyToRun())
                    session.startLaunching();
                break;
            }
        }
    }
    data->jsonMsg.clear();
    return 1;
}