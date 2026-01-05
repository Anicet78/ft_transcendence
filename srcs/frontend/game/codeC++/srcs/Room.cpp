#include "Room.hpp"

//Constructors/Destructors------------------------------------------------

Room::Room(void)
{
	static int i = 0;
	this->size = i++;
}

Room::~Room()
{}

//Member Functions--------------------------------------------------------

int Room::getSize() const
{
	return this->size;
}