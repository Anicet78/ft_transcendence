#include"game_sdl.hpp"

Engine gSdl;

int main(void) {
	if (!init_sdl(gSdl)) {
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	try
	{
		Assets::importAssets("assets/sprite/assets.bmp", 16);
		PlayerAssets::importPlayersAssets(100);
		Room::importRooms();
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
		return (0);
	}
	gSdl.room = *Room::getFloor0()["cross"];
	std::cout << gSdl.room << std::endl;
	mainloop(gSdl);
	return (0);
}
