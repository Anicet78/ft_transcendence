#include "Server.hpp"

int main()
{
    srand(time(0));
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
