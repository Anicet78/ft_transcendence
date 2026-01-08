#include"Assets.hpp"

std::map<int, SDL_Rect>	Assets::_assets;
SDL_Texture				*Assets::_texture;
int						Assets::_imgH;
int						Assets::_imgW;

Assets::Assets(void) {
	return ;
}

Assets::~Assets(void) {
	SDL_DestroyTexture(_texture);
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
	_texture = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!_texture)
	{
		std::string error = "Error in surface conversion to texture : ";
		error += SDL_GetError();
		throw std::runtime_error(error);
		return ;
	}

	_imgW = image->w;
	_imgH = image->h;

	//dont need surface anymore after conversion
	SDL_FreeSurface(image);

	//define every tile asset position and stock it in _assets
	int y = 0;
	int i = 0;
	while (y * tile_size < _imgH)
	{
		int x = 0;
		while (x * tile_size < _imgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_assets.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
	gSdl.setTileSize(tile_size);
}

// SDL_Rect	*Assets::getAssets(int index) {
// 	return (&_assets[index]);
// }


// render the asset at index "assetIndex" scaled by "scale" at the position x, y
// scale is supposed to be > 0
void		Assets::render(int x, int y, int assetIndex, int scale) {

	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x, y, _imgW, _imgH};
	SDL_Rect	*rect = &_assets[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	SDL_RenderCopy(gSdl.renderer, _texture, rect, &renderRect);
}
