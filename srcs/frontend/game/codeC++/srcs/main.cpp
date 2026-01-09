#include"game_sdl.hpp"

Engine gSdl;

int main(void)
{
	Map floor0(10, 10);
	srand(time(0));
	if (!init_sdl(gSdl)) {
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	try
	{
		Assets::importAssets("../images/assets.bmp", 16);
		Room::importRooms();
		floor0.fillMap();
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
		return (0);
	}
	printMap(floor0);
	mainloop(gSdl, floor0);
	return (0);
}
