#ifndef PLAYER_HPP
# define PLAYER_HPP

#include "Map.hpp"

class Player
{
private:

//player info
	int			_uid;
	int			_numPlayer;	//joueur 1 ou joueur 2 etc
	std::string	_name;

//player pos
	float		_x;
	float		_y;

//pos in map
	quadList	&_node;

//player stat
	int			_hp;
	int			_atk;
	int			_def;

//hitbox
	SDL_FRect	_wallHitBox;
	SDL_FRect	_hitBox;

public:
	Player(int uid, std::string name, quadList &node);
	~Player();

//getter
	int			getUid(void) const;
	std::string	getName(void) const;
	Room		&getRoom() const;
	quadList	getNode() const;

	float		getX(void) const;
	float		getY(void) const;

	int			getHp(void) const;
	int			getAtk(void) const;
	int			getDef(void) const;
	SDL_FRect	&getWallHitBox(void);

//setter
	void	setNode(const quadList &node);
	void	setPos(float x, float y);
	void	setHp(int hp);
	void	setAtk(int atk);
	void	setDef(int def);
	void	setWallHitBox(void);

//action
	void		move(void);
	void		attack(void);
	void		takeDamage(int amount);
	void		heal(int amount);
};

#endif