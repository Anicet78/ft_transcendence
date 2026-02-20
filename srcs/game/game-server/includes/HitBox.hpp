#ifndef HITBOX_HPP
# define HITBOX_HPP

# include "main.hpp"

class HitBox
{
	private:
		FRect	_atkHitBox;
		FRect	_hurtBox;

		bool		_atkActive;
		float		_tile_s;

		float		&_x;
		float		&_y;

		int			&_last_dir;
	public:
		HitBox(float &x, float &y, int &last_dir);
		~HitBox();

		FRect	&getAtkHitBox(void);
		FRect	&getDmgHitBox(void);

		void		updateAtkHitBox(void);
		void		updateHurtBox(void);
		bool		isDmgHit(FRect &rect) const;
};


#endif