#include "PlayerAssets.hpp"

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalk;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdle;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerHurt;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerDeath;

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalkFront;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttackFront;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdleFront;

std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerWalkBack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerAttackBack;
std::unordered_map<int, SDL_Rect>	PlayerAssets::_playerIdleBack;

SDL_Texture				*PlayerAssets::_playerWalkText;
SDL_Texture				*PlayerAssets::_playerAttackText;
SDL_Texture				*PlayerAssets::_playerIdleText;
SDL_Texture				*PlayerAssets::_playerHurtText;
SDL_Texture				*PlayerAssets::_playerDeathText;

SDL_Texture				*PlayerAssets::_playerWalkFrontText;
SDL_Texture				*PlayerAssets::_playerAttackFrontText;
SDL_Texture				*PlayerAssets::_playerIdleFrontText;

SDL_Texture				*PlayerAssets::_playerWalkBackText;
SDL_Texture				*PlayerAssets::_playerAttackBackText;
SDL_Texture				*PlayerAssets::_playerIdleBackText;

int						PlayerAssets::_walkImgW;
int						PlayerAssets::_walkImgH;

int						PlayerAssets::_atkImgW;
int						PlayerAssets::_atkImgH;

int						PlayerAssets::_idleImgW;
int						PlayerAssets::_idleImgH;

int						PlayerAssets::_hurtImgW;
int						PlayerAssets::_hurtImgH;

int						PlayerAssets::_deathImgW;
int						PlayerAssets::_deathImgH;

PlayerAssets::PlayerAssets(void)
{}

PlayerAssets::~PlayerAssets(void)
{
	SDL_DestroyTexture(_playerAttackText);
	SDL_DestroyTexture(_playerWalkText);
	SDL_DestroyTexture(_playerIdleText);
	SDL_DestroyTexture(_playerHurtText);
	SDL_DestroyTexture(_playerDeathText);

	SDL_DestroyTexture(_playerAttackFrontText);
	SDL_DestroyTexture(_playerWalkFrontText);
	SDL_DestroyTexture(_playerIdleFrontText);

	SDL_DestroyTexture(_playerAttackBackText);
	SDL_DestroyTexture(_playerWalkBackText);
	SDL_DestroyTexture(_playerIdleBackText);

	return ;
}

void	PlayerAssets::importAssets(std::string path, int tile_size, SDL_Texture *&texture,  std::unordered_map<int, SDL_Rect> &map, int &imgW, int &imgH)
{
	texture = loadTexture(path.c_str(), imgW, imgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < imgH)
	{
		int x = 0;
		while (x * tile_size < imgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			map.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	PlayerAssets::importPlayersAssets(int tile_size)
{
	importAssets("assets/sprite/Soldier-Walk.bmp", tile_size, _playerWalkText, _playerWalk, _walkImgW, _walkImgH);
	importAssets("assets/sprite/Soldier-Front-Walk.bmp", tile_size, _playerWalkFrontText, _playerWalkFront, _walkImgW, _walkImgH);
	importAssets("assets/sprite/Soldier-Back-Walk.bmp", tile_size, _playerWalkBackText, _playerWalkBack, _walkImgW, _walkImgH);

	importAssets("assets/sprite/Soldier-Attack.bmp", tile_size, _playerAttackText, _playerAttack, _atkImgW, _atkImgH);
	importAssets("assets/sprite/Soldier-Attack-Front.bmp", tile_size, _playerAttackFrontText, _playerAttackFront, _atkImgW, _atkImgH);
	importAssets("assets/sprite/Soldier-Attack-Back.bmp", tile_size, _playerAttackBackText, _playerAttackBack, _atkImgW, _atkImgH);

	importAssets("assets/sprite/Soldier-Idle.bmp", tile_size, _playerIdleText, _playerIdle, _idleImgW, _idleImgH);
	importAssets("assets/sprite/Soldier-Front-Idle.bmp", tile_size, _playerIdleFrontText, _playerIdleFront, _idleImgW, _idleImgH);
	importAssets("assets/sprite/Soldier-Back-Idle.bmp", tile_size, _playerIdleBackText, _playerIdleBack, _idleImgW, _idleImgH);

	importAssets("assets/sprite/Soldier-Hurt.bmp", tile_size, _playerHurtText, _playerHurt, _hurtImgW, _hurtImgH);

	importAssets("assets/sprite/Soldier-Death.bmp", tile_size, _playerDeathText, _playerDeath, _deathImgW, _deathImgH);

	gSdl.setPlayerSize(tile_size);
}






void	PlayerAssets::rendPlayerWalk(int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
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

void	PlayerAssets::rendPlayerWalkFront(int x, int y, int assetIndex, float scale, int flag)
{
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

void	PlayerAssets::rendPlayerWalkBack(int x, int y, int assetIndex, float scale, int flag)
{
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

void	PlayerAssets::rendPlayerAttack(int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
	
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

void	PlayerAssets::rendPlayerAttackFront(int x, int y, int assetIndex, float scale, int flag)
{
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

void	PlayerAssets::rendPlayerAttackBack(int x, int y, int assetIndex, float scale, int flag)
{
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

void	PlayerAssets::rendPlayerIdle(int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
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

void	PlayerAssets::rendPlayerIdleFront(int x, int y, int assetIndex, float scale, int flag)
{
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

void	PlayerAssets::rendPlayerIdleBack(int x, int y, int assetIndex, float scale, int flag)
{
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

void	PlayerAssets::rendPlayerHurt(int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
	
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerHurtText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerHurtText, 128);
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

	SDL_Rect	renderRect = {x - 84, y - 84, _hurtImgW, _hurtImgH};
	SDL_Rect	*rect = &_playerHurt[assetIndex];
	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!player_dir)
		SDL_RenderCopy(gSdl.renderer, _playerHurtText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _playerHurtText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_playerHurtText, 255);
}

void	PlayerAssets::rendPlayerDeath(int x, int y, int assetIndex, float scale, int player_dir, int flag)
{
	
	if (flag)
	{
		SDL_SetTextureBlendMode(_playerDeathText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_playerDeathText, 128);
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

	SDL_Rect	renderRect = {x - 84, y - 84, _deathImgW, _deathImgH};
	SDL_Rect	*rect = &_playerDeath[assetIndex];
	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!player_dir)
		SDL_RenderCopy(gSdl.renderer, _playerDeathText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _playerDeathText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_playerDeathText, 255);
}