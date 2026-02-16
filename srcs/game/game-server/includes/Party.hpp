#ifndef PARTY_HPP

# define PARTY_HPP

# include "Player.hpp"

class Party
{
	private:
		std::vector<std::weak_ptr<Player>>		_party;
		std::string								_partyId;
		int										_partySize;
		bool									_partyFull;
		int										_sessionSize;


	public:
		Party(std::string partyName, int partySize, int sessionSize);
		~Party();
	
	public:
		bool 									operator==(Party const &rhs);

	public:
		void									addPlayer(std::shared_ptr<Player> player);
		void									removePlayer(std::string &uid);
		void									setPartySize(size_t size);
		std::string								getPartyId(void) const;
		int										getSessionSize(void) const;
		std::vector<std::weak_ptr<Player>>		getPlayers(void) const;
		int										getPartySize(void) const;
		bool									isPartyFull(void) const;
		bool									isPlayerInParty(std::string &uid) const;
		void									setPlayerSession(void);
};

#endif