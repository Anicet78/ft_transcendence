#include "Map.hpp"

int main()
{
	Map floor0(30, 30);
	Room r1, r2, r3, r4, r5, r6, r7;
	quadList head = floor0.getHead();
	head->addRoom(r1);
	quadList tmp = head;
	tmp = head->_east.lock();
	tmp->addRoom(r2);
	tmp = tmp->_south.lock();
	tmp->addRoom(r3);
	tmp = tmp->_east.lock();
	tmp->addRoom(r4);
	tmp = tmp->_east.lock();
	tmp->addRoom(r5);
	tmp = tmp->_east.lock();
	tmp->addRoom(r6);
	tmp = tmp->_south.lock();
	tmp->addRoom(r7);

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