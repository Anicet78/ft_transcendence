#ifndef PLAYER_HPP
# define PLAYER_HPP

#include "Map.hpp"

class Player
{
private:

//player info
	std::string	_uid;
	int			_numPlayer;	//joueur 1 ou joueur 2 etc
	std::string	_name;

//player pos
	float		_x;
	float		_y;

//pos in map
	quadList	_node;
	int			_anim;

//player stat
	int			_hp;
	int			_atk;
	int			_def;

public:
	Player(std::string uid, std::string name);
	~Player();

//getter
	std::string	getUid(void) const;
	std::string	getName(void) const;
	Room		getRoom() const;
	quadList	getNode() const;

	float		getX(void) const;
	float		getY(void) const;

	int			getHp(void) const;
	int			getAtk(void) const;
	int			getDef(void) const;
	int			getAnim(void) const;

//setter
	void	setNode(const quadList &node);
	void	setPos(float x, float y);
	void	setHp(int hp);
	void	setAtk(int atk);
	void	setDef(int def);
	void	setAnim(int anim);

//action
	void		move(void);
	void		attack(void);
	void		takeDamage(int amount);
	void		heal(int amount);
};

#endif