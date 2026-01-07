#include "Texture.hpp"

Texture::Texture(std::string path) {
	loadImage(path);
	return ;
}

Texture::~Texture(void) {
	SDL_DestroyTexture(_texture);
	return ;
}

bool	Texture::loadImage(std::string &path) {
	SDL_Surface *image = SDL_LoadBMP(path.c_str());
	if (!image)
	{
		std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
		return (0);
	}
	SDL_Texture *texture = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!texture)
	{
		std::cerr << "Texture " << path << " conversion failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
		return (0);
	}
	_imageHeight = image->h;
	_imageWidth = image->w;
	_texture = texture;
	SDL_FreeSurface(image);
	return (1);
}


//render the texture scaled to the window full size
void	Texture::render(void) {
	SDL_RenderCopy(gSdl.renderer, _texture, NULL, NULL);
	return ;
}


//render a part of the texture on a precise spot x, y and use 'rect' to define the part of texture to take
void	Texture::renderRect(int x, int y, SDL_Rect *rect) {

	SDL_Rect	renderRect = {x, y, _imageWidth, _imageHeight};
	if (rect != NULL)
	{
		renderRect.w = rect->w;
		renderRect.h = rect->h;
	}
	SDL_RenderCopy(gSdl.renderer, _texture, rect, &renderRect);
}

int	Texture::getHeight(void) {
	return (_imageHeight);
}

int	Texture::getWidth(void) {
	return (_imageWidth);
}

SDL_Texture	*Texture::getTexture(void) {
	return (_texture);
}