#ifndef ROOM_HPP

# define ROOM_HPP

# include "main.hpp"

class Room
{
	private:
		int size;

	public:
		Room(void);
		~Room(void);
	
	public:
		int	getSize() const;
};

#endif