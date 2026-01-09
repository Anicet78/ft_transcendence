#ifndef PLAYERASSETS_HPP
# define PLAYERASSETS_HPP

#include"game_sdl.hpp"

class PlayerAssets
{
private:
	static std::vector<std::map<int, SDL_Rect> >	_players;

public:
	PlayerAssets(/* args */);
	~PlayerAssets();

	static void	importPlayersAssets(int nbrPlayer);

	static void	rendPlayer(int playerNum, int x, int y, int index, int scale);
};


#endif