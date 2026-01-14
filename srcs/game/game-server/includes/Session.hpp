#ifndef SESSION_HPP

# define SESSION_HPP

# include <iostream>
# include <string>
# include <vector>
# include <array>
# include <map>
# include <sstream>
# include <exception>
# include <queue>

class Session
{
	private:
		int							_numPlayer;
		std::vector<std::string>	_spectators;
		std::vector<std::string>	_players;
		bool						_running;


	public:
		Session(void);
		Session(int numPlayer);
		~Session();
	
	public:
		bool	addPlayer(std::string &newPlayer);
		bool	removePlayer(std::string &rmPlayer);
};


# endif