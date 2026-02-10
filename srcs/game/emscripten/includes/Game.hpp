#ifndef GAME_HPP

#define GAME_HPP

# include "Hud.hpp"


class Game
{
	private:
		std::vector<Map>	_maps;
		Player				&_player;
		std::vector<Player>	_otherPlayers;
		Hud					_hud;
		int					_launched;


	public:
		Game(Player &player);
		~Game(void);
	
	public:
		std::vector<Map>	&getMaps();
		Player				&getPlayer();
		std::vector<Player> &getOtherPlayers();
		Player				&getOtherPlayer(std::string &uid);
		int					getLaunched() const;
		void				setLaunched(int nb);
		void				drawHud();
		void				addMap(Map &map);
		void				clearOtherPlayers();
		bool				isInOtherPlayers(std::string &uid) const;
		void				addOtherPlayer(std::string &uid, std::string &name);
		void				suppOtherPlayer(std::string &uid);
};


#ifdef __EMSCRIPTEN__
	extern std::queue<val> msgJson;
#endif

int	init_sdl(Engine &gSdl);
void	game_loop(Game &game, double fps);

void	key_down(void);
void	key_up(void);
void	updateRoom(Game &game, Player &player, std::string dir);
void	print_map(Player &player);
void	print_others(Player &player, std::vector<Player> &otherPlayers);
void	print_mobs(MobRush &mobRush, Player &player);
void	loopPlayerState(Game &game, val playerUpdate);
void	loopRoomState(Game &game, val roomUpdate);
void	parseJson(bool &init, Game &game);
void	changeRoom(Game &game, val playerLeave);

#endif