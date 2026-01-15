#ifndef MOB_HPP
# define MOB_HPP

#include"game_sdl.hpp"

class Mob
{
private:
	static std::map<int, SDL_Rect>	_mobWalk;
	static std::map<int, SDL_Rect>	_mobAttack;
	static std::map<int, SDL_Rect>	_mobIdle;

	static SDL_Texture	*_mobWalkText;
	static SDL_Texture	*_mobAttackText;
	static SDL_Texture	*_mobIdleText;

	static int						_walkImgW;
	static int						_walkImgH;

	static int						_atkImgW;
	static int						_atkImgH;

	static int						_idleImgW;
	static int						_idleImgH;

	static void	importMobsWalkAssets(int tile_size);
	static void	importMobsAttackAssets(int tile_size);
	static void	importMobsIdleAssets(int tile_size);

//----------------------------------------------------
	float	_x;
	float	_y;

	int		_hp;

	int		_last_dir;

public:

	Mob(float x, float y, int hp);
	~Mob();

	static void	importMobsAssets(int tile_size);

	float	getX(void);
	float	getY(void);
	int		getHp(void);
	int		getLastDir(void);

	void	setPos(float x, float y);
	void	setHp(int hp);
	void	updateLastDir(void);

	void	rendMobWalk(int x, int y, int index, float scale);
	void	rendMobAttack(int x, int y, int index, float scale);
	void	rendMobIdle(int x, int y, int index, float scale);
};


#endif