#ifndef GAME_HPP

#define GAME_HPP

# include "Player.hpp"


class Game
{
	private:
		std::vector<Map>	_maps;
		Player				_player;
		std::vector<Player>	_otherPlayers;


	public:
		Game(Player &player);
		~Game(void);
	
	public:
		std::vector<Map>	getMaps() const;
		Player				&getPlayer();
		std::vector<Player> getOtherPlayers() const;
		Player				&getOtherPlayer(std::string &uid);
		void				addMap(Map &map);
		void				setPlayer(Player &player);
		void				clearOtherPlayers();
		bool				isInOtherPlayers(std::string &uid) const;
		void				addOtherPlayer(Player &player);
		void				suppOtherPlayer(std::string &uid);
};

enum state
{
	PLAYER_IDLE,
	PLAYER_WALKING,
	PLAYER_ATTACKING
};


extern Map		floor0;

#ifdef __EMSCRIPTEN__
	extern val msgJson;
#endif



int	init_sdl(Engine &gSdl);
void	game_loop(Game &game);
SDL_Texture *loadTexture(std::string path, Engine &sdl);

void	key_down(void);
void	key_up(void);
void	key_action(void);
void	updateRoom(Player &player);
void	print_player(float px, float py);
void	print_map(Player &player, std::vector<Player> otherPlayers);

#endif