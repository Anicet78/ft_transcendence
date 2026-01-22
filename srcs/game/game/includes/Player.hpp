#ifndef PLAYER_HPP
# define PLAYER_HPP

#include"Map.hpp"

class Player
{
private:

//player info
	int			_uid;
	int			_numPlayer;	//joueur 1 ou joueur 2 etc
	std::string	_name;

//player in room pos
	float		_x;
	float		_y;

//player pos on screen
	float	_screenX;
	float	_screenY;

//pos in map
	quadList	&_node;

//player stat
	int			_hp;
	int			_atk;
	int			_def;

//hitbox
	SDL_FRect	_wallHitBox;
	SDL_FRect	_hitBox;

	HitBox		_box;
	Camera		_camera;

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

	float		getScreenX(void) const;
	float		getScreenY(void) const;

	int			getHp(void) const;
	int			getAtk(void) const;
	int			getDef(void) const;
	SDL_FRect	&getWallHitBox(void);
	HitBox		&getBox(void);
	Camera		&getCamera(void);

//setter
	void	setNode(const quadList &node);
	void	setPos(float x, float y);
	void	setHp(int hp);
	void	setAtk(int atk);
	void	setDef(int def);
	void	setWallHitBox(void);

//action
	void		move(float timeStep);
	void		attack(void);
	void		takeDamage(int amount);
	void		heal(int amount);


	void	updateScreenPos(int tile_s);
};

#endif