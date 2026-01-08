#ifndef PLAYER_HPP
# define PLAYER_HPP

#include"game_sdl.hpp"

class Player
{
private:

//player info
	int			_uid;
	std::string	_name;

//player pos
	float		_x;
	float		_y;

//player stat
	int			_hp;
	int			_atk;
	int			_def;

public:
	Player(int uid, std::string name, int x, int y);
	~Player();

//getter
	int			getUid(void) const;
	std::string	getName(void) const;

	float		getX(void) const;
	float		getY(void) const;

	int			getHp(void) const;
	int			getAtk(void) const;
	int			getDef(void) const;

//setter
	void	setPos(float x, float y);
	void	setHp(int hp);
	void	setAtk(int atk);
	void	setDef(int def);

//action
	void		move(void);
	void		attack(void);
	void		takeDamage(int amount);
	void		heal(int amount);
};


#endif