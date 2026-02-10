#include"Game.hpp"

SDL_Texture *loadTexture(std::string path, int &imgW, int &imgH)
{

	//we firs need to load the image into a surface
	SDL_Surface *image = SDL_LoadBMP(path.c_str());
	if (!image)
	{
		std::string	error = "Image " + path + " load failed ! SDL_Error: " + SDL_GetError();
		throw std::runtime_error(error);
	}

	//convert it into texture
	SDL_Texture *texture = SDL_CreateTextureFromSurface(gSdl.renderer, image);
	if (!texture)
	{
		SDL_FreeSurface(image);
		std::string error = "Texture " + path + " conversion failed ! SDL_Error:" + SDL_GetError();
		throw std::runtime_error(error);
	}

	imgW = image->w;
	imgH = image->h;

	//dont need surface anymore after conversion
	SDL_FreeSurface(image);
	return (texture);
}