#include"heads.hpp"

SDL_Texture *loadTexture(std::string path, Engine &sdl) {

	SDL_Surface *image = SDL_LoadBMP(path.c_str());
	if (!image)
	{
		std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
		return (NULL);
	}
	SDL_Texture *texture = SDL_CreateTextureFromSurface(sdl.renderer, image);
	if (!texture)
	{
		std::cerr << "Texture " << path << " conversion failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
		return (NULL);
	}
	SDL_FreeSurface(image);
	return (texture);
}

//Load the "path" image into a surface, do not care about image size and will erased border if too big.
//return : NULL if surface creation or image opening fail
// SDL_Surface *loadSurface(std::string path, Engine &sdl) {

// 	SDL_Surface *image = SDL_LoadBMP(path.c_str());
// 	if (!image)
// 		std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
// 	SDL_Texture *texture = SDL_CreateTextureFromSurface(sdl.renderer, image)
// 	return (image);
// }

//Load "path" image and optimize it for the "winSurf" surface (entire surface of the window).
//return : NULL if surface creation or optimization fail
//It is recommanded if :
// - Use a lot of SDL_Blit... of this image in the main loop.
// - Image is not the same format as the "winSurf" surface.
// - Stretch will be apply on it
// SDL_Surface *loadOptimizedSurface(std::string path, SDL_Surface *winSurf) {

// 	SDL_Surface	*optimized = NULL;

// 	SDL_Surface *image = SDL_LoadBMP(path.c_str());
// 	if (!image) {
// 		std::cerr << "Image " << path << " load failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
// 		return (NULL);
// 	}
// 	else {
// 		optimized = SDL_ConvertSurface(image, winSurf->format, 0);
// 		if (!optimized) {
// 			std::cerr << "Image " << path << " optimization failed ! " << "SDL Error: " << SDL_GetError() << std::endl;
// 		}
// 		SDL_FreeSurface(image);
// 	}
// 	return (optimized);
// }