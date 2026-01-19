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

void    Server::manageQueue()
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

void    Server::removePlayer(std::string &uid)
{
    for (auto it = _players.begin(); it != _players.end();)
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
                for (Session &session : _sessions)
                {
                    if (session.isPlayerInSession(uid))
                    {
                        session.removePlayer(*it);
                        break ;
                    }
                }
            }
            this->_players.erase(it);
            return ;
        }
    }
}

void	Server::run(void)
{
	uWS::App()
        .ws<PerSocketData>("/*", uWS::App::WebSocketBehavior<PerSocketData>{
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
                    executeJson(data, ws);
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
                // std::cout << this->_players.size() << '|' << std::endl;
                // std::cout << this->_matchMakingQueue.size() << '|' << std::endl;
                // if (_sessions.size())
                //     std::cout << this->_sessions[0].getNumPlayers() << '|' << std::endl;
            }
        })
        .listen(3000, [](auto *token)
        {
            if (token)
            {
                std::cout << "Serveur WebSocket sur le port 3000\n";
            }
        })
        .run();
}