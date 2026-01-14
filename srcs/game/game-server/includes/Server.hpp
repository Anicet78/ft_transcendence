#ifndef SERVER_HPP

# define SERVER_HPP

# include "Session.hpp"

typedef struct PerSocketData
{
    std::string playerId;
    std::string pseudo;
    std::string room; //room is designing an appartenance at a game room, with all of the other players of the session
	std::string group; //group is is for the group with you launch the game (before matchmaking)
	int			groupSize;//size of the group
    std::map<std::string, std::string> jsonMsg;
} PerSocketData;

class Server
{
	private:
		std::vector<Session> _sessions;
		std::list<Player> _matchMakingQueue;

	private:
		void	parseJson(std::map<std::string, std::string> &res, std::string msg);
		void	executeJson(PerSocketData *data);
		void	addPlayerOnQueue(Player &player);
		void	manageQueue(void);

	public:
		Server(void);
		~Server();
	
	public:
		void	run();

};

#endif