#ifndef KEY_HPP
# define KEY_HPP

# include "main.hpp"

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

	bool	walking(void);
	bool	attacking(void);

	Key(void);
	~Key(void);
};

#endif