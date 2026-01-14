#include "Mob.hpp"

std::map<int, SDL_Rect>	Mob::_mobWalk;
std::map<int, SDL_Rect>	Mob::_mobAttack;
std::map<int, SDL_Rect>	Mob::_mobIdle;

SDL_Texture	*Mob::_mobWalkText;
SDL_Texture	*Mob::_mobAttackText;
SDL_Texture	*Mob::_mobIdleText;

int						Mob::_walkImgW;
int						Mob::_walkImgH;

int						Mob::_atkImgW;
int						Mob::_atkImgH;

int						Mob::_idleImgW;
int						Mob::_idleImgH;

Mob::Mob(void) {

}

Mob::~Mob(void) {

}

void	Mob::importMobsWalkAssets(int tile_size) {
		SDL_Surface *image = SDL_LoadBMP("assets/sprite/Orc-Walk.bmp");
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
			_mobWalk.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
	_mobWalkText = text;
}

void	Mob::importMobsIdleAssets(int tile_size) {
		SDL_Surface *image = SDL_LoadBMP("assets/sprite/Orc-Idle.bmp");
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
			_mobIdle.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
	_mobIdleText = text;
}

void	Mob::importMobsAttackAssets(int tile_size) {
		SDL_Surface *image = SDL_LoadBMP("assets/sprite/Orc-Attack01.bmp");
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
			_mobAttack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
	_mobAttackText = text;
}

void	Mob::importMobsAssets(int tile_size) {
	importMobsIdleAssets(tile_size);
	importMobsWalkAssets(tile_size);
	importMobsAttackAssets(tile_size);
	return ;
}

void	Mob::setPos(float x, float y) {
	_x = x;
	_y = y;
	return ;
}

void	Mob::setHp(int hp) {
	_hp = hp;
	return ;
}

float	Mob::getX(void) {
	return (_x);
}

float	Mob::getY(void) {
	return (_y);
}

int		Mob::getHp(void) {
	return (_hp);
}

int		Mob::getLastDir(void) {
	return (_last_dir);
}

void	Mob::rendMobWalk(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _walkImgW, _walkImgH};
	SDL_Rect	*rect = &_mobWalk[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobWalkText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobWalkText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
}

void	Mob::rendMobIdle(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _idleImgW, _idleImgH};
	SDL_Rect	*rect = &_mobIdle[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobIdleText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobIdleText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
}

void	Mob::rendMobAttack(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _atkImgW, _atkImgH};
	SDL_Rect	*rect = &_mobAttack[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobAttackText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobAttackText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
}