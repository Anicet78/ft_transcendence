#include "Map.hpp"

void printRooms(Map &map)
{
	auto nodes = map.getNodes();
    for (int y = 0; y < 7; y++)
    {
        for (int x = 0; x < 7; x++)
        {
            auto node = nodes[y * 7 + x];
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



int main()
{
	Map floor0(7, 7);
	srand(time(0));
	try
	{
		Room::importRooms();
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
	}
	
	floor0.fillMap();

	auto tab = floor0.getNodes();
	for (int i = 0; i < 7; i++)
	{
		for (int j = 0; j < 7; j++)
		{
			if (tab[i * 7 + j]->getRoom() && tab[i * 7 + j]->getRoom()->getName() == "start")
				std::cout << "P ";
			else if (tab[i * 7 + j]->getRoom() && tab[i * 7 + j]->getRoom()->getName() == "stairs")
				std::cout << "S ";
			else if (tab[i * 7 + j]->getPath())
			{
				std::cout << tab[i * 7 + j]->getPath();
				if (tab[i * 7 + j]->getPath() < 10)
					std::cout << ' ';
			}
			else
				std::cout << ". ";
			std::cout << ' ';
		}
		std::cout << '\n';
	}
	//printRooms(floor0);
	return 0;
}