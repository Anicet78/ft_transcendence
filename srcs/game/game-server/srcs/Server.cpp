# include "Server.hpp"
#include "../uWebSockets/src/App.h"

Server::Server(void)
{}

Server::~Server(void)
{}

//-----------------------------------------------------------------

void	Server::addPlayerOnQueue(Player &player)
{
	this->_matchMakingQueue.push_back(player);
}

static Session &chooseSession(std::vector<Session> &sessions, std::list<Player> &matchQueue)
{
    for (Session &s : sessions)
    {

    }
}

void    Server::manageQueue()
{
   while (_matchMakingQueue.size())
   {
        auto &player = _matchMakingQueue.begin()
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
                    executeJson(data);
                    this->manageQueue();
                    ws->send("yo man !", uWS::OpCode::TEXT);
                }
                catch(const std::exception& e)
                {
                    std::cerr << e.what() << '\n';
                }
            },
            .close = [](auto *ws, int code, std::string_view msg)
            {
                (void)ws, (void)code, (void)msg;
                std::cout << "Client déconnecté\n";
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