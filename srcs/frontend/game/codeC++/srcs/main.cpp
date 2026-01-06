#include "Map.hpp"

int main()
{
	Map floor0(5, 5);
	srand(time(0));
	try
	{
		Room::importRooms();
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
	}
	
	quadList row = floor0.getHead();
	for (int i = 0; i < 5; i++)
	{
		quadList col = row;
		for (int j = 0; j < 5; j++)
		{
			if (col->getRoom())
				std::cout << col->getRoom()->getWidth();
			else
				std::cout << '.';
			std::cout << ' ';
			col = col->_east.lock();
		}
		std::cout << '\n';
		row = row->_south.lock();
	}
	
	auto f0 = Room::getFloor0();

	Room r1 = *f0.at("l").get();
	std::cout << r1 << std::endl;
	return 0;
}