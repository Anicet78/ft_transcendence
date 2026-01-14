#ifndef SERVER_HPP

# define SERVER_HPP

# include "Session.hpp"

typedef struct PerSocketData
{
    std::string playerId;
    std::string pseudo;
    std::string room;
    std::map<std::string, std::string> jsonMsg;
} PerSocketData;

class Server
{
	private:
		std::vector<Session> _sessions;
		std::queue<std::string> _matchMakingQueue;

	private:
		void	parseJson(std::map<std::string, std::string> &res, std::string msg);
		void	executeJson(PerSocketData *data);
		void	addPlayerOnQueue(std::string &player);
		void	manageQueue(void);

	public:
		Server(void);
		~Server();
	
	public:
		void	run();

};

#endif