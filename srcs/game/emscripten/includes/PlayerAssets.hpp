#ifndef PLAYERASSETS_HPP
# define PLAYERASSETS_HPP

# include "Assets.hpp"

class Player;

class PlayerAssets
{
	private:

		static std::map<int, SDL_Rect>	_playerWalk;
		static std::map<int, SDL_Rect>	_playerAttack;
		static std::map<int, SDL_Rect>	_playerIdle;

		static SDL_Texture	*_playerWalkText;
		static SDL_Texture	*_playerAttackText;
		static SDL_Texture	*_playerIdleText;
		
		static SDL_Texture* mapRenderTexture;

		static int						_walkImgW;
		static int						_walkImgH;

		static int						_atkImgW;
		static int						_atkImgH;

		static int						_idleImgW;
		static int						_idleImgH;

		PlayerAssets(void);
		~PlayerAssets();

		static void	importPlayersWalkAssets(int tile_size);
		static void	importPlayersAttackAssets(int tile_size);
		static void	importPlayersIdleAssets(int tile_size);

	public:

		static void	importPlayersAssets(int tile_size);

		static void	rendPlayerWalk(int playerNum, int x, int y, int index, float scale, int player_dir);
		static void	rendPlayerAttack(int playerNum, int x, int y, int index, float scale, int player_dir);
		static void	rendPlayerIdle(int playerNum, int x, int y, int index, float scale, int player_dir);

};


#endif