#include "Key.hpp"

Key::Key(void) : w_key(0), a_key(0), s_key(0),
				d_key(0), e_key(0), space(0), shift(0)
{
	return ;
}

Key::~Key(void) {
	return ;
}

bool	Key::walking(void) {
	if (w_key || s_key || a_key || d_key)
		return true;
	return false;
}

bool	Key::attacking(void) {
	if (space)
		return true;
	return false;
}