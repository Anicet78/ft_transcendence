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

void updatePlayerPos(Player &player, std::map<std::string, std::string> &req)
{
    Room room = player.getRoom();
	float x = player.getX(), y = player.getY();
	auto plan = room.getRoomPlan();
	if (req["w_key"] == "true")
	{
		y -= 0.1;
		if (y >= 0 && plan[y][x] != '1')
			player.setPos(x, y);
		else
			y += 0.1;
	}
	if (req["a_key"] == "true")
	{
		x -= 0.1;
		if (x >= 0 && plan[y][x] != '1')
			player.setPos(x, y);
		else
			x += 0.1;
	}
	if (req["s_key"] == "true")
	{
		y += 0.1;
		if (y < room.getHeight() && plan[y][x] != '1')
			player.setPos(x, y);
		else
			y -= 0.1;
	}
	if (req["d_key"] == "true")
	{
		x += 0.1;
		if (x < room.getWidth() && plan[y][x] != '1')
			player.setPos(x, y);
		else
			x -= 0.1;
	}
    if (!req["last_dir"].empty())
		player.setLastDir(std::atoi(req["last_dir"].c_str()));
    if (!req["anim"].empty())
    {
        if (req["anim"] == "idling")
            player.setAnim(0);
        else if (req["anim"] == "walking")
            player.setAnim(1);
        else if (req["anim"] == "attacking")
            player.setAnim(2);
    }
}

void updateRoom(Player &player)
{
    Room room = player.getRoom();
	auto plan = room.getRoomPlan();
	float x = player.getX(), y = player.getY();

	if (plan[y][x] == 'E')
	{
		auto exitsLoc = room.getExitsLoc();

		if (exitsLoc[2][0] == static_cast<int>(x) && exitsLoc[2][1] == static_cast<int>(y)
			&& !player.getNode()->south.expired())
		{
            player.setExit('S');
			player.setNode(player.getNode()->south.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[0][0] + 0.5, exitsLoc[0][1] + 1);
		}
		else if (exitsLoc[0][0] == static_cast<int>(x) && exitsLoc[0][1] == static_cast<int>(y)
			&& !player.getNode()->north.expired())
		{
            player.setExit('N');
			player.setNode(player.getNode()->north.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[2][0] + 0.5, exitsLoc[2][1] - 0.1);
		}
		else if (exitsLoc[1][0] == static_cast<int>(x) && exitsLoc[1][1] == static_cast<int>(y)
			&& !player.getNode()->east.expired())
		{
            player.setExit('E');
			player.setNode(player.getNode()->east.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[3][0] + 1, exitsLoc[3][1] + 0.5);
		}
		else if (exitsLoc[3][0] == static_cast<int>(x) && exitsLoc[3][1] == static_cast<int>(y)
			&& !player.getNode()->west.expired())
		{
            player.setExit('W');
			player.setNode(player.getNode()->west.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[1][0] - 0.1, exitsLoc[1][1] + 0.5);
		}
        else
            player.setExit(0);
	}
}

void sendPlayerState(Player &player, Session &session, std::string uid_leave)
{
    std::string msg =   "{ \"action\" : \"player_state\", \"player_x\" : " + std::to_string(player.getX()) + ", "
                        + "\"player_y\" : " + std::to_string(player.getY()) + ", "
                        + "\"player_health\" : " + std::to_string(player.getHp()) + ", "
                        + "\"player_anim\" : " + std::to_string(player.getAnim()) + ", "
                        + "\"player_exit\" : \"" + player.getExit() + "\"";
    player.setExit(' ');
    int sumPlayer = 1;
    for (auto &oplayer : session.getPlayers())
    {
        if (oplayer->getUid() == player.getUid())
            continue ;
        if (oplayer->getNode() == player.getNode())
        {
            msg += ", \"player" + std::to_string(sumPlayer) + "_x\" : " + std::to_string(oplayer->getX()) + ", "
                    + "\"player" + std::to_string(sumPlayer) + "_y\" : " + std::to_string(oplayer->getY()) + ", "
                    + "\"player" + std::to_string(sumPlayer) + "_id\" : \"" + oplayer->getUid() + "\", "
                    + "\"player" + std::to_string(sumPlayer) + "_name\" : \"" + oplayer->getName() + "\", "
                    + "\"player" + std::to_string(sumPlayer) + "_health\" : " + std::to_string(oplayer->getHp()) + ", "
                    + "\"player" + std::to_string(sumPlayer) + "_anim\" : " + std::to_string(oplayer->getAnim()) + ", "
                    + "\"player" + std::to_string(sumPlayer) + "_dir\" : " + std::to_string(oplayer->getLastDir()) + ", "
                    + "\"player" + std::to_string(sumPlayer) + "_exit\" : \"" + oplayer->getExit() + "\"";
            if (!uid_leave.empty() && uid_leave == oplayer->getUid())
                msg += + ", \"player" + std::to_string(sumPlayer) + "_leave\" : \"true\"";
            oplayer->setExit(' ');
            sumPlayer++;
        }
    }
    msg += ", \"player_num\" : " + std::to_string(sumPlayer) + "}";
    player.getWs()->send(msg);
}

int Server::executeJson(PerSocketData *data, uWS::WebSocket<false, true, PerSocketData> *ws)
{
    std::map<std::string, std::string> &req = data->jsonMsg;
    
    if (req["action"] == "join_queue")
    {
		data->pseudo = req["player_name"];
        data->playerId = req["player_id"];
        data->group = req["group_id"];
        data->groupSize = std::atoi(req["group_size"].c_str());
        ws->send("You have been added in the queue !", uWS::OpCode::TEXT);
        this->_players.emplace_back(std::make_shared<Player>(data->playerId, data->groupSize, data->group, data->pseudo, ws));
        this->addPlayerOnQueue(_players.back());
        data->jsonMsg.clear();
        return 0;
    }
    else if (req["action"] == "player_move" || req["action"] == "connected")
    {
        for (Session &session : _sessions)
        {
            if (session.isPlayerInSession(ws->getUserData()->playerId))
            {
                std::shared_ptr<Player> player = session.getPlayer(ws->getUserData()->playerId);
                if (req["action"] == "player_move")
                {
                    updatePlayerPos(*player, req);
                    updateRoom(*player);
                }
                sendPlayerState(*player, session, "");
                for (auto &oplayer : session.getPlayers())
                {
                    if (oplayer->getUid() == player->getUid())
                        continue ;
                    if (oplayer->getNode() == player->getNode())
                        sendPlayerState(*oplayer, session, "");
                }
                break;
            }
        }
    }
    data->jsonMsg.clear();
    return 1;
}