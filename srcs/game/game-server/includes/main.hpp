# ifndef MAIN_HPP

# define MAIN_HPP

# include "../uWebSockets/src/App.h"
# include <iostream>
# include <array>
# include <string>
# include <cstdlib>
# include <ctime>
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
# include <sstream>
# include <list>

typedef struct FRect
{
	float x;
	float y;
	float w;
	float h;
} FRect;

typedef struct Rect
{
	int x;
	int y;
	int w;
	int h;
} Rect;

typedef struct FPoint
{
	float x;
	float y;
} FPoint;

#endif