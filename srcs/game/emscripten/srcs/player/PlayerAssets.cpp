#include "PlayerAssets.hpp"

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalk;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdle;

SDL_Texture				*PlayerAssets::_playerWalkText;
SDL_Texture				*PlayerAssets::_playerAttackText;
SDL_Texture				*PlayerAssets::_playerIdleText;

SDL_Texture				*PlayerAssets::mapRenderTexture = nullptr;

int						PlayerAssets::_walkImgW;
int						PlayerAssets::_walkImgH;

int						PlayerAssets::_atkImgW;
int						PlayerAssets::_atkImgH;

int						PlayerAssets::_idleImgW;
int						PlayerAssets::_idleImgH;

PlayerAssets::PlayerAssets(void)
{}

PlayerAssets::~PlayerAssets(void) {
	SDL_DestroyTexture(_playerAttackText);
	SDL_DestroyTexture(_playerWalkText);
	SDL_DestroyTexture(_playerIdleText);
	return ;
}


void	PlayerAssets::importPlayersWalkAssets(int tile_size)
{
	_playerWalkText = loadTexture("assets/sprite/Soldier-Walk.bmp", _walkImgW, _walkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _walkImgH)
	{
		int x = 0;
		while (x * tile_size < _walkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerWalk.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}



void	PlayerAssets::importPlayersAttackAssets(int tile_size) {

	_playerAttackText = loadTexture("assets/sprite/Soldier-Attack01.bmp", _atkImgW, _atkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkImgH)
	{
		int x = 0;
		while (x * tile_size < _atkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerAttack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersIdleAssets(int tile_size) {

	_playerIdleText = loadTexture("assets/sprite/Soldier-Idle.bmp", _idleImgW, _idleImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _idleImgH)
	{
		int x = 0;
		while (x * tile_size < _idleImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerIdle.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersAssets(int tile_size)
{
	importPlayersWalkAssets(tile_size);
	importPlayersAttackAssets(tile_size);
	importPlayersIdleAssets(tile_size);
	gSdl.setPlayerSize(tile_size);
}






void	PlayerAssets::rendPlayerWalk(int playerNum, int x, int y, int assetIndex, float scale, int player_dir)
{
	(void)playerNum;
	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _walkImgW, _walkImgH};
	SDL_Rect	*rect = &_playerWalk[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!player_dir)
		SDL_RenderCopy(gSdl.renderer, _playerWalkText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _playerWalkText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
}

void	PlayerAssets::rendPlayerAttack(int playerNum, int x, int y, int assetIndex, float scale, int player_dir)
{
	(void)playerNum;
	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _atkImgW, _atkImgH};
	SDL_Rect	*rect = &_playerAttack[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!player_dir)
		SDL_RenderCopy(gSdl.renderer, _playerAttackText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _playerAttackText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
}

void	PlayerAssets::rendPlayerIdle(int playerNum, int x, int y, int assetIndex, float scale, int player_dir)
{
	(void)playerNum;
	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) 
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _idleImgW, _idleImgH};
	SDL_Rect	*rect = &_playerIdle[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!player_dir)
		SDL_RenderCopy(gSdl.renderer, _playerIdleText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _playerIdleText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
}