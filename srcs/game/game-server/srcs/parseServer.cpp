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

void Server::executeJson(PerSocketData *data, uWS::WebSocket<false, true, PerSocketData> *ws)
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
    }
}