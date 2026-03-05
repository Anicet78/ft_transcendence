#include "Server.hpp"

int main(int argc, char **argv, char **env)
{
    (void)argc, (void)argv;


    //gather serverId from ENV
    std::string serverId;

    int i = 0;
    while(env[i])
    {
        serverId = env[i];
        if (serverId.find("GAME_CLIENT_ID=") != serverId.npos)
            break;
        i++;
    }
    size_t start = serverId.find('=') + 1;
    serverId = serverId.substr(start, serverId.size() - start);
    //------------------------

    //gather serverSecret from secret file
    std::string secret;
    std::ifstream secretFile;

    secretFile.open("/run/secrets/game_secret");
    if (secretFile.is_open())
        std::getline(secretFile, secret);
    //------------------------------------

    srand(time(0));
    Server serv(serverId, secret);
    try
    {
        Room::importRooms();
    }
    catch(const std::exception& e)
    {
        std::cerr << e.what() << '\n';
    }
    
    serv.run();
}
