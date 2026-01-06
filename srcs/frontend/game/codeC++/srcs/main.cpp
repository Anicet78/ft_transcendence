#include"game_sdl.hpp"

Engine gSdl;

int main(void) {
	SDL_Texture	*keyTextures[KEY_PRESS_SURFACE_TOTAL];
	// Engine gSdl;

	if (!init_sdl(gSdl)) {
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	// if (!init_surfaces(keyTextures, gSdl)) {
	// 	std::cerr << "Error in surfaces init" << std::endl;
	// 	return (1);
	// }
	mainloop(gSdl, keyTextures);
	return (0);
}