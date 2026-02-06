#ifndef PLAYER_HPP
# define PLAYER_HPP

#include "Map.hpp"

enum state
{
	PLAYER_IDLE,
	PLAYER_WALKING,
	PLAYER_ATTACKING
};

class Player
{
	private:
	//player info
		std::string	_uid;
		int			_numPlayer;
		std::string	_name;
		SDL_Texture	*_nameTexture;

	//player pos
		float		_x;
		float		_y;

	//player pos on screen
		float	_screenX;
		float	_screenY;

	//pos in map
		quadList	_node;
		int			_anim;

	//player stat
		int			_hp;
		int			_atk;
		int			_def;
	
	//	player action

		bool		_atkState;

	//camera

		Camera		_camera;

	//player anim
		int				_floor;
		int				_last_dir;
		int				_frame;
		int				_prev_state;

	public:
		Player(std::string uid, std::string name, SDL_Color color);
		~Player();

	//getter
		std::string	getUid(void) const;
		std::string	getName(void) const;
		Room		&getRoom() const;
		Room		&getRoomRef(void);
		quadList	getNode() const;

		float		getX(void) const;
		float		getY(void) const;

		float		getScreenX(void) const;
		float		getScreenY(void) const;

		int			getHp(void) const;
		int			getAtk(void) const;
		int			getDef(void) const;

		Camera		&getCamera(void);
	
		int			getAnim(void) const;
		int			getFrame(void) const;
		int			getLastDir(void) const;
		int			getFloor(void) const;

	//setter
		void	setNode(const quadList &node);
		void	setPos(float x, float y);
		void	setHp(int hp);
		void	setAtk(int atk);
		void	setDef(int def);
		void	setAnim(int anim);
		void	setDir(int dir);

		void	updateLastDir(void);
		void	incrementFloor(void);

	//print
		void	printPlayer(float px, float py);

	//player attacking action
		void	startAtk(void);
		void	endAtk(void);
		bool	checkAtkState(void) const;

	//action
		void		move(void);
		void		attack(void);
		void		takeDamage(int amount);
		void		heal(int amount);

		void	updateScreenPos(int tile_s);
};

#endif