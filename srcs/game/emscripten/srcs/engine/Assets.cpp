#include"Assets.hpp"

std::unordered_map<int, SDL_Rect>	Assets::_mapAssets;
SDL_Texture				*Assets::_MapTexture;
int						Assets::_MapImgH;
int						Assets::_MapImgW;

Assets::Assets(void) {
	return ;
}

Assets::~Assets(void) {
	SDL_DestroyTexture(_MapTexture);
	return ;
}

void Assets::importAssets(std::string path, int tile_size) {

	//we firs need to load the image into a surface
	SDL_Surface *image = SDL_LoadBMP(path.c_str());
	if (!image)
	{
		std::string error = "Error in image conversion to surface : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}
	//convert it into texture
	_MapTexture = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!_MapTexture)
	{
		std::string error = "Error in surface conversion to texture : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
	}
	_MapImgW = image->w;
	_MapImgH = image->h;

	//dont need surface anymore after conversion
	SDL_FreeSurface(image);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _MapImgH)
	{
		int x = 0;
		while (x * tile_size < _MapImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mapAssets.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
	gSdl.setMapTileSize(tile_size);
}

// SDL_Rect	*Assets::getAssets(int index) {
// 	return (&_mapAssets[index]);
// }


// render the asset at index "assetIndex" scaled by "scale" at the position x, y
// scale is supposed to be > 0
void		Assets::rendMap(int x, int y, int assetIndex, float scale) {

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

	SDL_Rect	renderRect = {x, y, _MapImgW, _MapImgH};
	SDL_Rect	*rect = &_mapAssets[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _MapTexture, rect, &renderRect);
}

