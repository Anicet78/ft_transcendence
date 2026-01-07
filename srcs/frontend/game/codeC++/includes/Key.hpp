#ifndef KEY_HPP
# define KEY_HPP

# include <iostream>
# include <SDL2/SDL.h>
# include <memory>
# include <vector>
# include <fstream>

class Key
{
public:
	bool	w_key;
	bool	a_key;
	bool	s_key;
	bool	d_key;
	bool	e_key;
	bool	space;
	bool	shift;

	Key(void);
	~Key(void);
};

#endif