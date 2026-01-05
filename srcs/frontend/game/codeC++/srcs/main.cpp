#include "Map.hpp"

int main()
{
	Map floor0(30, 30);
	try
	{
		Room::importRooms();
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
	}
	
	quadList row = floor0.getHead();
	for (int i = 0; i < 30; i++)
	{
		quadList col = row;
		for (int j = 0; j < 30; j++)
		{
			if (col->getRoom())
				std::cout << col->getRoom()->getSize();
			else
				std::cout << '.';
			std::cout << ' ';
			col = col->_east.lock();
		}
		std::cout << '\n';
		row = row->_south.lock();
	}
	
	return 0;
}