#include"game_sdl.hpp"



int main(void) {
	SDL_Surface	*keySurfaces[KEY_PRESS_SURFACE_TOTAL];
	SDL_Window	*window = NULL;

	if (!init_sdl(window, keySurfaces)) {
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	if (!mainloop(window, keySurfaces)) {
		SDL_DestroyWindow(window);
		SDL_Quit();
	}
	return (0);
}