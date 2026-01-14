#ifndef SESSION_HPP

# define SESSION_HPP

# include "Player.hpp"

class Session
{
	private:
		int							_maxNumPlayer;
		std::vector<std::string>	_spectators;//maybe spectator class later
		std::vector<Player>			_players;
		std::vector<Map>			_map;
		bool						_running;


	public:
		Session(void);
		Session(int numPlayer);
		~Session();
	
	public:
		bool	addPlayer(Player &newPlayer);
		bool	removePlayer(Player &rmPlayer);
		int		getMaxNumPlayer() const;
		int		getNumPlayers() const;
};


# endif