#include "Texture.hpp"

Texture::Texture(std::string path) : _texture(NULL) {
	loadImage(path);
	return ;
}

Texture::Texture(Texture const &src) {
	*this = src;
	return ;
}

Texture	&Texture::operator=(Texture const &src) {
	Uint32	format;
	int access;
	int w;
	int h;

	if (this == &src)
		return (*this);
	if (this->_texture != NULL)
		SDL_DestroyTexture(_texture);
	SDL_QueryTexture(src._texture, &format, &access, &w, &h);
	this->_texture = SDL_CreateTexture(gSdl.renderer, format, SDL_TEXTUREACCESS_TARGET, w, h);
	SDL_Texture* oldTarget = SDL_GetRenderTarget(gSdl.renderer);
	SDL_SetRenderTarget(gSdl.renderer, this->_texture);
	SDL_RenderCopy(gSdl.renderer, src._texture, NULL, NULL);
	SDL_SetRenderTarget(gSdl.renderer, oldTarget);
	this->_imageHeight = src._imageHeight;
	this->_imageWidth = src._imageWidth;
	return (*this);
}

Texture::~Texture(void) {
	SDL_DestroyTexture(_texture);
	return ;
}

bool	Texture::loadImage(std::string &path) {

	// load BMP file into a surface
	SDL_Surface *image = SDL_LoadBMP(path.c_str());
	if (!image)
	{
		std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
		return (0);
	}
	
	//convert it into texture
	SDL_Texture *texture = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!texture)
	{
		std::cerr << "Texture " << path << " conversion failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
		return (0);
	}
	_imageHeight = image->h;
	_imageWidth = image->w;
	_texture = texture;

	//dont need surface anymore after conversion
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

int	Texture::getH(void) {
	return (_imageHeight);
}

int	Texture::getW(void) {
	return (_imageWidth);
}

SDL_Texture	*Texture::getTexture(void) {
	return (_texture);
}