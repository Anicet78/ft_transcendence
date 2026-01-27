#ifndef MOB_HPP
# define MOB_HPP

#include"HitBox.hpp"

class Mob
{
private:

//mob pos
	float	_x;
	float	_y;

	int		_hp;

	int		_last_dir;

	// int		_anim;
	int		_frame;

//mob state
	bool	_isInvinsible;
	bool	_isDead;
	int		_invFrame;

	HitBox	_box;

public:

	Mob(float x, float y, int hp);
	~Mob();

	float	getX(void) const;
	float	getY(void) const;
	int		getHp(void) const;
	int		getLastDir(void) const;
	int		getFrame(void) const;
	int		getInvFrame(void) const;
	HitBox	&getBox(void);


	void	setPos(float x, float y);
	void	setHp(int hp);
	void	setInvFrame(int invFrame);
	void	updateLastDir(void);

//make the mob invinsible after getting attacked
	void	startInvinsibleFrame(void);
	void	endInvinsibleFrame(void);
	bool	checkInvinsibleFrame(void);

//mob die interaction
	void	die(void);
	bool	isDead(void);
};


#endif