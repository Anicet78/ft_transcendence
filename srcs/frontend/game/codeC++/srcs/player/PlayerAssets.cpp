#include "PlayerAssets.hpp"

std::map<int, SDL_Rect>	PlayerAssets::_playerWalk;
std::map<int, SDL_Rect>	PlayerAssets::_playerAttack;
std::map<int, SDL_Rect>	PlayerAssets::_playerIdle;

SDL_Texture				*PlayerAssets::_playerWalkText;
SDL_Texture				*PlayerAssets::_playerAttackText;
SDL_Texture				*PlayerAssets::_playerIdleText;

SDL_Texture				*PlayerAssets::mapRenderTexture = nullptr;
int						PlayerAssets::lastRenderWidth = 0;
int						PlayerAssets::lastRenderHeight = 0;

int						PlayerAssets::_walkImgW;
int						PlayerAssets::_walkImgH;

int						PlayerAssets::_atkImgW;
int						PlayerAssets::_atkImgH;

int						PlayerAssets::_idleImgW;
int						PlayerAssets::_idleImgH;

PlayerAssets::PlayerAssets(void) {
	return ;
}

PlayerAssets::~PlayerAssets(void) {
	SDL_DestroyTexture(_playerAttackText);
	SDL_DestroyTexture(_playerWalkText);
	SDL_DestroyTexture(_playerIdleText);
	return ;
}


void	PlayerAssets::importPlayersWalkAssets(int tile_size) {
		SDL_Surface *image = SDL_LoadBMP("assets/sprite/Soldier-Walk.bmp");
	if (!image)
	{
		std::string error = "Error in image conversion to surface : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}

	//convert it into texture
	SDL_Texture	*text = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!text)
	{
		std::string error = "Error in surface conversion to texture : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}

	_walkImgW = image->w;
	_walkImgH = image->h;
	//dont need surface anymore after conversion
	SDL_FreeSurface(image);

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
	_playerWalkText = text;
}



void	PlayerAssets::importPlayersAttackAssets(int tile_size) {
		SDL_Surface *image = SDL_LoadBMP("assets/sprite/Soldier-Attack01.bmp");
	if (!image)
	{
		std::string error = "Error in image conversion to surface : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}

	//convert it into texture
	SDL_Texture	*text = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!text)
	{
		std::string error = "Error in surface conversion to texture : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}

	_atkImgW = image->w;
	_atkImgH = image->h;

	//dont need surface anymore after conversion
	SDL_FreeSurface(image);

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
	_playerAttackText = text;
}

void	PlayerAssets::importPlayersIdleAssets(int tile_size) {
		SDL_Surface *image = SDL_LoadBMP("assets/sprite/Soldier-Idle.bmp");
	if (!image)
	{
		std::string error = "Error in image conversion to surface : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}

	//convert it into texture
	SDL_Texture	*text = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!text)
	{
		std::string error = "Error in surface conversion to texture : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}

	_idleImgW = image->w;
	_idleImgH = image->h;

	//dont need surface anymore after conversion
	SDL_FreeSurface(image);

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
	_playerIdleText = text;
}

void	PlayerAssets::importPlayersAssets(int tile_size) {
	importPlayersWalkAssets(tile_size);
	importPlayersAttackAssets(tile_size);
	importPlayersIdleAssets(tile_size);
	gSdl.setPlayerSize(tile_size);
}






void	PlayerAssets::rendPlayerWalk(int playerNum, int x, int y, int assetIndex, float scale)
{
	(void)playerNum;
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
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

	SDL_RenderCopy(gSdl.renderer, _playerWalkText, rect, &renderRect);
}

void	PlayerAssets::rendPlayerAttack(int playerNum, int x, int y, int assetIndex, float scale)
{
	(void)playerNum;
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
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

	SDL_RenderCopy(gSdl.renderer, _playerAttackText, rect, &renderRect);
}

void	PlayerAssets::rendPlayerIdle(int playerNum, int x, int y, int assetIndex, float scale)
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

	SDL_RenderCopy(gSdl.renderer, _playerIdleText, rect, &renderRect);
}