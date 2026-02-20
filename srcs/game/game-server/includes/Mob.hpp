#ifndef MOB_HPP
# define MOB_HPP

# include "HitBox.hpp"
class Player;

enum state
{
	MOB_IDLE,
	MOB_WALKING,
	MOB_ATTACKING,
	MOB_HURT,
	MOB_DODGE,
	MOB_RUNNING,
	MOB_CHASE_LAST,
	MOB_WANDERING,
	MOB_CHASING
};

class Mob
{
	private:

	//mob pos
		float	_x;
		float	_y;
		float	_lastX;
		float	_lastY;

		int		_hp;

		int		_last_dir;
		int		_dirWalk;
		int		_state;
		int		_routine;
		float	_lastPlayerX;
		float	_lastPlayerY;
		std::chrono::_V2::steady_clock::time_point	_timeAction;

		// int		_anim;
		int		_frame;

	//mob state
		bool	_isInvinsible;
		bool	_isDead;
		int		_invFrame;
		bool	_tookDamage;
		bool	_sendDeath;
		

		HitBox	_box;
		FRect	_wallHitBox;

	private:
		void	wanderingRoutine(std::vector<std::string> const &map);
		void	chasingRoutine(Player &player, std::vector<std::string> const &map);
		bool	isInSight(Player &player, std::vector<std::string> const &map);
		void	move(std::vector<std::string> const &map, float px, float py, float scaleX, float scaleY);
		void	moveDodge(std::vector<std::string> const &map, float px, float py, float scaleX, float scaleY);
		void	attack(Player &player);
		void	dodge(Player &player, std::vector<std::string> const &map);

	public:

		Mob(float x, float y, int hp);
		~Mob();

		float	getX(void) const;
		float	getY(void) const;
		int		getHp(void) const;
		int		getLastDir(void) const;
		int		getDirWalk(void) const;
		int		getState(void) const;
		int		getRoutine(void) const;
		double	getTimeLastAction(void) const;
		int		getFrame(void) const;
		int		getInvFrame(void) const;
		HitBox	&getBox(void);
		FRect	&getWallHitBox(void);


		void	setPos(float x, float y);
		void	setTimeAction(void);
		void	setState(int state);
		void	setHp(int hp);
		void	setInvFrame(int invFrame);
		void	updateLastDir(int dir);
		void	updateDirWalk(int dir);
		void	setWallHitBox(void);

	//make the mob invinsible after getting attacked
		void	startInvinsibleFrame(void);
		void	endInvinsibleFrame(void);
		void	MobAction(Player &player, std::vector<std::string> const &map);
		bool	checkInvinsibleFrame(void);

	//mob die and damage interaction
		void	die(void);
		bool	isDead(void) const;
		void	damaged(bool value);
		bool	isDamaged(void) const;

		void	setSendDeath(bool value);
		bool	isDeathSend(void) const;
};

float	dist(float px, float py, Mob const &mob);


#endif