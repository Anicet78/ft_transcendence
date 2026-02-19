#include "PlayerAssets.hpp"

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalk;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdle;

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalkFront;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttackFront;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdleFront;

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalkBack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttackBack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdleBack;

SDL_Texture				*PlayerAssets::_playerWalkText;
SDL_Texture				*PlayerAssets::_playerAttackText;
SDL_Texture				*PlayerAssets::_playerIdleText;

SDL_Texture				*PlayerAssets::_playerWalkFrontText;
SDL_Texture				*PlayerAssets::_playerAttackFrontText;
SDL_Texture				*PlayerAssets::_playerIdleFrontText;

SDL_Texture				*PlayerAssets::_playerWalkBackText;
SDL_Texture				*PlayerAssets::_playerAttackBackText;
SDL_Texture				*PlayerAssets::_playerIdleBackText;

SDL_Texture				*PlayerAssets::mapRenderTexture = nullptr;

int						PlayerAssets::_walkImgW;
int						PlayerAssets::_walkImgH;

int						PlayerAssets::_atkImgW;
int						PlayerAssets::_atkImgH;

int						PlayerAssets::_idleImgW;
int						PlayerAssets::_idleImgH;

PlayerAssets::PlayerAssets(void)
{}

PlayerAssets::~PlayerAssets(void)
{
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


void	PlayerAssets::importPlayersWalkFrontAssets(int tile_size)
{
	_playerWalkFrontText = loadTexture("assets/sprite/Soldier-Front-Walk.bmp", _walkImgW, _walkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _walkImgH)
	{
		int x = 0;
		while (x * tile_size < _walkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerWalkFront.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersWalkBackAssets(int tile_size)
{
	_playerWalkBackText = loadTexture("assets/sprite/Soldier-Back-Walk.bmp", _walkImgW, _walkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _walkImgH)
	{
		int x = 0;
		while (x * tile_size < _walkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerWalkBack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}


void	PlayerAssets::importPlayersAttackAssets(int tile_size)
{

	_playerAttackText = loadTexture("assets/sprite/Soldier-Attack.bmp", _atkImgW, _atkImgH);

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

void	PlayerAssets::importPlayersAttackFrontAssets(int tile_size)
{

	_playerAttackFrontText = loadTexture("assets/sprite/Soldier-Attack-Front.bmp", _atkImgW, _atkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkImgH)
	{
		int x = 0;
		while (x * tile_size < _atkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerAttackFront.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersAttackBackAssets(int tile_size)
{

	_playerAttackBackText = loadTexture("assets/sprite/Soldier-Attack-Back.bmp", _atkImgW, _atkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkImgH)
	{
		int x = 0;
		while (x * tile_size < _atkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerAttackBack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersIdleAssets(int tile_size)
{

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

void	PlayerAssets::importPlayersIdleFrontAssets(int tile_size)
{

	_playerIdleFrontText = loadTexture("assets/sprite/Soldier-Front-Idle.bmp", _idleImgW, _idleImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _idleImgH)
	{
		int x = 0;
		while (x * tile_size < _idleImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerIdleFront.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersIdleBackAssets(int tile_size)
{

	_playerIdleBackText = loadTexture("assets/sprite/Soldier-Back-Idle.bmp", _idleImgW, _idleImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _idleImgH)
	{
		int x = 0;
		while (x * tile_size < _idleImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_playerIdleBack.emplace(i, rect);
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

	importPlayersIdleFrontAssets(tile_size);
	importPlayersAttackFrontAssets(tile_size);
	importPlayersWalkFrontAssets(tile_size);

	importPlayersIdleBackAssets(tile_size);
	importPlayersAttackBackAssets(tile_size);
	importPlayersWalkBackAssets(tile_size);

	gSdl.setPlayerSize(tile_size);
}






void	PlayerAssets::rendPlayerWalk(int playerNum, int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerWalkText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerWalkText, 128);
	}
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
	if (flag)
		SDL_SetTextureAlphaMod(_playerWalkText, 255);
}

void	PlayerAssets::rendPlayerWalkFront(int playerNum, int x, int y, int assetIndex, float scale, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerWalkFrontText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerWalkFrontText, 128);
	}
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
	SDL_Rect	*rect = &_playerWalkFront[assetIndex];
	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _playerWalkFrontText, rect, &renderRect);
	if (flag)
		SDL_SetTextureAlphaMod(_playerWalkFrontText, 255);
}

void	PlayerAssets::rendPlayerWalkBack(int playerNum, int x, int y, int assetIndex, float scale, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerWalkBackText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerWalkBackText, 128);
	}
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
	SDL_Rect	*rect = &_playerWalkBack[assetIndex];
	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _playerWalkBackText, rect, &renderRect);
	if (flag)
		SDL_SetTextureAlphaMod(_playerWalkBackText, 255);
}

void	PlayerAssets::rendPlayerAttack(int playerNum, int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
	(void)playerNum;
	
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerAttackText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerAttackText, 128);
	}
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
	if (flag)
		SDL_SetTextureAlphaMod(_playerAttackText, 255);
}

void	PlayerAssets::rendPlayerAttackFront(int playerNum, int x, int y, int assetIndex, float scale, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerAttackFrontText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerAttackFrontText, 128);
	}
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
	SDL_Rect	*rect = &_playerAttackFront[assetIndex];
	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _playerAttackFrontText, rect, &renderRect);
	if (flag)
		SDL_SetTextureAlphaMod(_playerAttackFrontText, 255);
}

void	PlayerAssets::rendPlayerAttackBack(int playerNum, int x, int y, int assetIndex, float scale, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerAttackBackText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerAttackBackText, 128);
	}
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
	SDL_Rect	*rect = &_playerAttackBack[assetIndex];
	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _playerAttackBackText, rect, &renderRect);
	if (flag)
		SDL_SetTextureAlphaMod(_playerAttackBackText, 255);
}

void	PlayerAssets::rendPlayerIdle(int playerNum, int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerIdleText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerIdleText, 128);
	}
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
	if (flag)
		SDL_SetTextureAlphaMod(_playerIdleText, 255);
}

void	PlayerAssets::rendPlayerIdleFront(int playerNum, int x, int y, int assetIndex, float scale, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerIdleFrontText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerIdleFrontText, 128);
	}
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
	SDL_Rect	*rect = &_playerIdleFront[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _playerIdleFrontText, rect, &renderRect);
	if (flag)
		SDL_SetTextureAlphaMod(_playerIdleFrontText, 255);
}

void	PlayerAssets::rendPlayerIdleBack(int playerNum, int x, int y, int assetIndex, float scale, int flag)
{
	(void)playerNum;
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerIdleBackText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerIdleBackText, 128);
	}
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
	SDL_Rect	*rect = &_playerIdleBack[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _playerIdleBackText, rect, &renderRect);
	if (flag)
		SDL_SetTextureAlphaMod(_playerIdleBackText, 255);
}