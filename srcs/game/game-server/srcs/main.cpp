#include "Server.hpp"

int main()
{
    Server serv;
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
