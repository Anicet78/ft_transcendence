#ifndef PARTY_HPP

# define PARTY_HPP

# include "Player.hpp"

class Party
{
	private:
		std::vector<std::weak_ptr<Player>>		_party;
		std::string								_partyName;
		int										_partySize;
		bool									_partyFull;
		int										_partyId;


	public:
		Party(std::string partyName, int partySize);
		~Party();
	
	public:
		bool 									operator==(Party const &rhs);

	public:
		void									addPlayer(std::shared_ptr<Player> player);
		void									removePlayer(std::string &uid);
		void									setPartySize(size_t size);
		std::string								getPartyName() const;
		std::vector<std::weak_ptr<Player>>		getPlayers() const;
		int										getPartySize() const;
		bool									isPartyFull() const;
		bool									isPlayerInParty(std::string &uid) const;
		void									setPlayerSession();
};

#endif