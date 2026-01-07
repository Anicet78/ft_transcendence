#include "Map.hpp"

void printRooms(Map &map)
{
	auto nodes = map.getNodes();
    for (int y = 0; y < 5; y++)
    {
        for (int x = 0; x < 5; x++)
        {
            auto node = nodes[y * 5 + x];
            if (!node->getRoom()) continue;

            auto room = node->getRoom();
            auto exits = room->getExits();
            std::cout << "Room at (" << x << "," << y << "): " 
                      << room->getName() << " | "
                      << "N=" << exits[0] << " E=" << exits[1] 
                      << " S=" << exits[2] << " W=" << exits[3] 
                      << std::endl;
        }
    }
}



// int main()
// {
// 	Map floor0(5, 5);
// 	srand(time(0));
// 	try
// 	{
// 		Room::importRooms();
// 	}
// 	catch(const std::exception& e)
// 	{
// 		std::cerr << e.what() << '\n';
// 	}
	
// 	floor0.fillMap();

// 	auto tab = floor0.getNodes();
// 	for (int i = 0; i < 5; i++)
// 	{
// 		for (int j = 0; j < 5; j++)
// 		{
// 			if (tab[i * 5 + j]->getPath() == 1)
// 				std::cout << 1;
// 			else if (tab[i * 5 + j]->getPath() == 2)
// 				std::cout << 2;
// 			else if (tab[i * 5 + j]->getPath() == 3)
// 				std::cout << 3;
// 			else
// 				std::cout << '.';
// 			std::cout << ' ';
// 		}
// 		std::cout << '\n';
// 	}
// 	//printRooms(floor0);
// 	return 0;
// }