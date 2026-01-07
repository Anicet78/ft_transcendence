#include"game_sdl.hpp"

Engine gSdl;

int main(void) {
	try
	{
		Room::importRooms();
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
	}
	gSdl.room = *Room::getFloor0()["cross"];

	std::cout << gSdl.room << std::endl;
	if (!init_sdl(gSdl)) {
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	// if (!init_surfaces(keyTextures, gSdl)) {
	// 	std::cerr << "Error in surfaces init" << std::endl;
	// 	return (1);
	// }
	mainloop(gSdl);
	return (0);
}