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
            throw std::runtime_error("Json imput invalid syntax");
        if ((pos2 = buffer.find("\":")) == std::string::npos)
            throw std::runtime_error("Json imput invalid syntax");
        pos1++;
        std::string key = buffer.substr(pos1, pos2 - pos1);
        std::string value;
        pos1 = pos2 + 2;
        if ((pos1 = buffer.find('\"', pos1)) == std::string::npos)
        {
            if (isdigit(buffer[pos1]))
                value = buffer.substr(pos1);
            else
                throw std::runtime_error("Json imput invalid syntax");
        }
        else if ((pos2 = buffer.find('\"', pos1 + 1)) == std::string::npos)
            throw std::runtime_error("Json imput invalid syntax");
        else
        {
            pos1++;
            value = buffer.substr(pos1, pos2 - pos1);
        }
        res.emplace(key, value);
    }
    
}

void Server::executeJson(PerSocketData *data)
{
    std::map<std::string, std::string> &req = data->jsonMsg;
    
    if (req["action"] == "join_queue")
    {
		data->pseudo = req["player_name"];
        data->playerId = req["player_id"];
        data->group = req["group_id"];
        data->groupSize = std::atoi(req["group_size"].c_str());
        this->addPlayerOnQueue(data->pseudo);
    }
}