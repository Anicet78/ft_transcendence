#ifndef GAME_HPP

#define GAME_HPP

# include "Player.hpp"


class Game
{
	private:
		std::vector<Map>	_maps;
		Player				&_player;
		std::vector<Player>	_otherPlayers;


	public:
		Game(Player &player);
		~Game(void);
	
	public:
		std::vector<Map>	&getMaps();
		Player				&getPlayer();
		std::vector<Player> &getOtherPlayers();
		Player				&getOtherPlayer(std::string &uid);
		void				addMap(Map &map);
		void				clearOtherPlayers();
		bool				isInOtherPlayers(std::string &uid) const;
		void				addOtherPlayer(Player &player);
		void				suppOtherPlayer(std::string &uid);
};


extern Map		floor0;

#ifdef __EMSCRIPTEN__
	extern val msgJson;
#endif

int	init_sdl(Engine &gSdl);
void	game_loop(Game &game);

void	key_down(void);
void	key_up(void);
void	updateRoom(Game &game, Player &player, std::string dir);
void	print_map(Player &player);
void	print_others(Player &player, std::vector<Player> &otherPlayers);

#endif