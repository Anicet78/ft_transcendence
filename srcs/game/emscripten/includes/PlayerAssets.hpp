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

		static std::unordered_map<int, SDL_Rect>	_playerWalkFront;
		static std::unordered_map<int, SDL_Rect>	_playerAttackFront;
		static std::unordered_map<int, SDL_Rect>	_playerIdleFront;

		static std::unordered_map<int, SDL_Rect>	_playerWalkBack;
		static std::unordered_map<int, SDL_Rect>	_playerAttackBack;
		static std::unordered_map<int, SDL_Rect>	_playerIdleBack;

		static SDL_Texture	*_playerWalkText;
		static SDL_Texture	*_playerAttackText;
		static SDL_Texture	*_playerIdleText;

		static SDL_Texture	*_playerWalkFrontText;
		static SDL_Texture	*_playerAttackFrontText;
		static SDL_Texture	*_playerIdleFrontText;

		static SDL_Texture	*_playerWalkBackText;
		static SDL_Texture	*_playerAttackBackText;
		static SDL_Texture	*_playerIdleBackText;
		
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

		static void	importPlayersWalkFrontAssets(int tile_size);
		static void	importPlayersAttackFrontAssets(int tile_size);
		static void	importPlayersIdleFrontAssets(int tile_size);

		static void	importPlayersWalkBackAssets(int tile_size);
		static void	importPlayersAttackBackAssets(int tile_size);
		static void	importPlayersIdleBackAssets(int tile_size);

	public:

		static void	importPlayersAssets(int tile_size);

		static void	rendPlayerWalk(int playerNum, int x, int y, int index, float scale, int player_dir);
		static void	rendPlayerAttack(int playerNum, int x, int y, int index, float scale, int player_dir);
		static void	rendPlayerIdle(int playerNum, int x, int y, int index, float scale, int player_dir);

		static void	rendPlayerWalkFront(int playerNum, int x, int y, int index, float scale);
		static void	rendPlayerAttackFront(int playerNum, int x, int y, int index, float scale);
		static void	rendPlayerIdleFront(int playerNum, int x, int y, int index, float scale);

		static void	rendPlayerWalkBack(int playerNum, int x, int y, int index, float scale);
		static void	rendPlayerAttackBack(int playerNum, int x, int y, int index, float scale);
		static void	rendPlayerIdleBack(int playerNum, int x, int y, int index, float scale);

};


#endif