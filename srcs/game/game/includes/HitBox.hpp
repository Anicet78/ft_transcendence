#ifndef HITBOX_HPP
# define HITBOX_HPP

#include"Engine.hpp"

class HitBox
{
private:
	SDL_FRect	_wallHitBox;
	SDL_FRect	_atkHitBox;
	SDL_FRect	_dmgHitBox;

	bool		_atkActive;
	float		_tile_s;

	float		&_playerX;
	float		&_playerY;

	float		&_screenX;
	float		&_screenY;
public:
	// HitBox(void);
	HitBox(float &playerX, float &playerY, float &screenX, float &screenY, int last_dir);
	~HitBox();

	SDL_FRect	getWallHitBox(void);
	SDL_FRect	getAtkHitBox(void);
	SDL_FRect	getDmgHitBox(void);

	void		updateHitBox(int last_dir);
	bool		isDmgHit(SDL_FRect &rect) const;

	void		printHitBox(void);
};


#endif