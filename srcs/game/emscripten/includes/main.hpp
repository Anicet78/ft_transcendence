#ifndef MAIN_HPP

# define MAIN_HPP

# include <SDL2/SDL.h>
# include <SDL2/SDL_ttf.h>
# include <iostream>
# include <array>
# include <string>
# include <cstdlib>
# include <ctime>
# include <cmath>
# include <memory>
# include <vector>
# include <map>
# include <sys/types.h>
# include <dirent.h>
# include <exception>
# include <fstream>
# include <cmath>
# include <queue>
# include <unordered_map>
# include <algorithm>
# include <cmath>
# include <chrono>
#ifdef __EMSCRIPTEN__
	#include <emscripten/val.h>
	#include <emscripten.h>
	#include <emscripten/bind.h>
	using namespace emscripten;
#endif

# define SCREEN_WIDTH 800
# define SCREEN_HEIGHT 950

# define MAX_FPS 60

# define GAME_HEIGHT 800

SDL_Texture *loadTexture(std::string path, int &imgW, int &imgH);

#endif