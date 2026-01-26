#ifndef MOB_HPP
# define MOB_HPP

# include "main.hpp"

class Mob
{
private:
	float	_x;
	float	_y;

	int		_hp;

	int		_last_dir;

	// int		_anim;
	int		_frame;

	bool	_isInvinsible;

	// HitBox	_box;

public:

	Mob(float x, float y, int hp);
	~Mob();

	float	getX(void) const;
	float	getY(void) const;
	int		getHp(void) const;
	int		getLastDir(void) const;
	int		getFrame(void) const;
	// HitBox	&getBox(void);


	void	setPos(float x, float y);
	void	setHp(int hp);
	void	updateLastDir(void);

//make the mob invinsible after getting attacked
	void	startInvinsibleFrame(void);
	void	endInvinsibleFrame(void);
	bool	checkInvinsibleFrame(void);
};


#endif