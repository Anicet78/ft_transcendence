#include "Map.hpp"

void printRooms(Map &map)
{
	auto nodes = map.getNodes();
    for (int i = 0; i < map.getHeight(); i++)
	{
		for (int j = 0; j < map.getWidth(); j++)
		{
            auto node = nodes[i * map.getWidth() + j];
            std::cout << node->getPath() << ' ';
        }
		std::cout << std::endl;
    }
}

void printMap(Map &floor0)
{
	auto tab = floor0.getNodes();
	for (int i = 0; i < floor0.getHeight(); i++)
	{
		for (int j = 0; j < floor0.getWidth(); j++)
		{
			auto cell = tab[i * floor0.getWidth() + j];
			auto room = cell->getRoom();

			if (room && room->getName() == "start")
				std::cout << 'P';
			else if (room && room->getName() == "stairs")
				std::cout << 'S';
			else if (room)
			{
				bool N = room->getExits()[0];
				bool E = room->getExits()[1];
				bool S = room->getExits()[2];
				bool O = room->getExits()[3];

				int count = N + E + S + O;

				// 4 directions
				if (count == 4)
					std::cout << "╬";

				// 3 directions
				else if (count == 3)
				{
					if (!S) std::cout << "╩";   // ouvert E S O
					else if (!E) std::cout << "╣"; // ouvert N S O
					else if (!N) std::cout << "╦"; // ouvert N E O
					else if (!O) std::cout << "╠"; // ouvert N E S
				}

				// 2 directions
				else if (count == 2)
				{
					if (N && S) std::cout << "║";       // vertical
					else if (E && O) std::cout << "═";  // horizontal
					else if (N && E) std::cout << "╚";  // coin bas-gauche
					else if (E && S) std::cout << "╔";  // coin haut-gauche
					else if (S && O) std::cout << "╗";  // coin haut-droite
					else if (O && N) std::cout << "╝";  // coin bas-droite
				}

				// 1 direction (cul-de-sac)
				else if (count == 1)
				{
					if (N) std::cout << "╨"; // cul-de-sac vers le haut
					else if (E) std::cout << "╞"; // cul-de-sac vers la droite
					else if (S) std::cout << "╥"; // cul-de-sac vers le bas
					else if (O) std::cout << "╡"; // cul-de-sac vers la gauche
				}

				// 0 direction (pièce isolée)
				else
					std::cout << "■";
			}
			else
				std::cout << '.';

			//std::cout << ' ';
		}
 	   std::cout << '\n';
	}
}
