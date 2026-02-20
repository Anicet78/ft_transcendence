#ifndef PLAYERASSETS_HPP
# define PLAYERASSETS_HPP

# include "Assets.hpp"

class Player;

class PlayerAssets
{
	private:

		static std::unordered_map<int, SDL_Rect>	_playerWalk;
		static std::unordered_map<int, SDL_Rect>	_playerAttack;
		static std::unordered_map<int, SDL_Rect>	_playerIdle;
		static std::unordered_map<int, SDL_Rect>	_playerHurt;
		static std::unordered_map<int, SDL_Rect>	_playerDeath;

		static std::unordered_map<int, SDL_Rect>	_playerWalkFront;
		static std::unordered_map<int, SDL_Rect>	_playerAttackFront;
		static std::unordered_map<int, SDL_Rect>	_playerIdleFront;

		static std::unordered_map<int, SDL_Rect>	_playerWalkBack;
		static std::unordered_map<int, SDL_Rect>	_playerAttackBack;
		static std::unordered_map<int, SDL_Rect>	_playerIdleBack;

		static SDL_Texture	*_playerWalkText;
		static SDL_Texture	*_playerAttackText;
		static SDL_Texture	*_playerIdleText;
		static SDL_Texture	*_playerHurtText;
		static SDL_Texture	*_playerDeathText;

		static SDL_Texture	*_playerWalkFrontText;
		static SDL_Texture	*_playerAttackFrontText;
		static SDL_Texture	*_playerIdleFrontText;

		static SDL_Texture	*_playerWalkBackText;
		static SDL_Texture	*_playerAttackBackText;
		static SDL_Texture	*_playerIdleBackText;
		
		static int						_walkImgW;
		static int						_walkImgH;

		static int						_atkImgW;
		static int						_atkImgH;

		static int						_idleImgW;
		static int						_idleImgH;

		static int						_hurtImgW;
		static int						_hurtImgH;

		static int						_deathImgW;
		static int						_deathImgH;

		PlayerAssets(void);
		~PlayerAssets();

		static void importAssets(std::string path, int tile_size, SDL_Texture *&texture,  std::unordered_map<int, SDL_Rect> &map, int &imgW, int &imgH);

	public:

		static void	importPlayersAssets(int tile_size);

		static void	rendPlayerWalk(int x, int y, int index, float scale, int player_dir, int flag);
		static void	rendPlayerAttack(int x, int y, int index, float scale, int player_dir, int flag);
		static void	rendPlayerIdle(int x, int y, int index, float scale, int player_dir, int flag);
		static void	rendPlayerHurt(int x, int y, int index, float scale, int player_dir, int flag);
		static void	rendPlayerDeath(int x, int y, int index, float scale, int player_dir, int flag);

		static void	rendPlayerWalkFront(int x, int y, int index, float scale, int flag);
		static void	rendPlayerAttackFront(int x, int y, int index, float scale, int flag);
		static void	rendPlayerIdleFront(int x, int y, int index, float scale, int flag);

		static void	rendPlayerWalkBack(int x, int y, int index, float scale, int flag);
		static void	rendPlayerAttackBack(int x, int y, int index, float scale, int flag);
		static void	rendPlayerIdleBack(int x, int y, int index, float scale, int flag);

};


#endif