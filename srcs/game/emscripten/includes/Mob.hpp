#ifndef MOB_HPP
# define MOB_HPP

#include"PlayerAssets.hpp"

enum stateMob
{
	MOB_IDLE,
	MOB_WALKING,
	MOB_ATTACKING,
	MOB_HURT,
	MOB_WANDERING,
	MOB_CHASING
};

class Mob
{
	private:
		static std::unordered_map<int, SDL_Rect>	_mobWalk;
		static std::unordered_map<int, SDL_Rect>	_mobAttack;
		static std::unordered_map<int, SDL_Rect>	_mobIdle;
		static std::unordered_map<int, SDL_Rect>	_mobHurt;

		static SDL_Texture	*_mobWalkText;
		static SDL_Texture	*_mobAttackText;
		static SDL_Texture	*_mobIdleText;
		static SDL_Texture	*_mobHurtText;

		static int						_walkImgW;
		static int						_walkImgH;

		static int						_atkImgW;
		static int						_atkImgH;

		static int						_idleImgW;
		static int						_idleImgH;

		static int						_hurtImgW;
		static int						_hurtImgH;

		static void	importMobsWalkAssets(int tile_size);
		static void	importMobsAttackAssets(int tile_size);
		static void	importMobsIdleAssets(int tile_size);
		static void	importMobsHurtAssets(int tile_size);

	//----------------------------------------------------
		const int	_id;
		
		float	_x;
		float	_y;

		float	_screenX;
		float	_screenY;

		int		_hp;

		int		_last_dir;

		int		_anim;
		int		_prev_state;
		int		_frame;

		bool	_isDead;

	public:

		Mob(int id, float x, float y, int hp);
		~Mob();

		static void	importMobsAssets(int tile_size);

		float	getX(void) const;
		float	getY(void) const;
		float	getScreenX(void) const;
		float	getScreenY(void) const;
		int		getLastDir(void) const;
		int		getHp(void) const;
		int		getAnim(void) const;
		int		getFrame(void) const;
		void	updateScreenPos(float camX, float camY, int tile_s);


		void	setPos(float x, float y);
		void	setHp(int hp);
		void	setAnim(int anim);
		void	updateLastDir(int dir);

	//make the mob invinsible after getting attacked

		bool	isDead(void) const;
		void	setIsDead(bool value);

	//mob renderer
		void	rendMobWalk(int x, int y, int index, float scale, int flag);
		void	rendMobAttack(int x, int y, int index, float scale, int flag);
		void	rendMobIdle(int x, int y, int index, float scale, int flag);
		void	rendMobHurt(int x, int y, int index, float scale, int flag);

		void	printMob(float camX, float camY, int tile_size, int flag);
};


#endif