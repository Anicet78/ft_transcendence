#ifndef HITBOX_HPP
# define HITBOX_HPP

#include"Engine.hpp"

class HitBox
{
private:
	SDL_FRect	_atkHitBox;
	SDL_FRect	_hurtBox;

	bool		_atkActive;
	float		_tile_s;

	float		&_x;
	float		&_y;

	float		&_screenX;
	float		&_screenY;

	int			&_last_dir;
public:
	HitBox(float &x, float &y, float &screenX, float &screenY, int &last_dir);
	~HitBox();

	SDL_FRect	&getAtkHitBox(void);
	SDL_FRect	&getDmgHitBox(void);

	void		updateHitBox(void);
	bool		isDmgHit(SDL_FRect &rect) const;

	void		printHitBox(void);
};


#endif