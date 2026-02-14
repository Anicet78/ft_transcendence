#include "Party.hpp"

bool Party::operator==(Party const &rhs)
{
	return this->_partyId == rhs._partyId;
}

//Constructors/Destructors------------------------------------------------

Party::Party(std::string partyName, int partySize): _partyName(partyName), _partySize(partySize), _partyFull(0), _partyId(rand() % 1000000)
{}

Party::~Party()
{}

//Member Functions--------------------------------------------------------

void Party::addPlayer(std::shared_ptr<Player> player)
{
	if (player && player->getPartyName() == this->_partyName)
	{
		this->_party.push_back(player);
		if (this->_partySize == static_cast<int>(this->_party.size()))
			this->_partyFull = true;
	}
	else if (player)
		throw std::runtime_error("this player does not belong in this party");
	else
		throw std::runtime_error("this player does not exists");
}

std::string Party::getPartyName() const
{
	return this->_partyName;
}

std::vector<std::weak_ptr<Player>> Party::getPlayers() const
{
	return this->_party;
}

void Party::removePlayer(std::string &uid)
{
	for (auto it = _party.begin(); it != _party.end(); it++)
	{
		if (!it->expired() && it->lock()->getUid() == uid)
		{
			this->_party.erase(it);
			return ;
		}
	}		
}

void Party::setPartySize(size_t size)
{
	this->_partySize = static_cast<int>(size);
}

bool Party::isPlayerInParty(std::string &uid) const
{
	for (auto &player : _party)
		if (!player.expired() && player.lock()->getUid() == uid)
			return true;
	return false;
}

int Party::getPartySize() const
{
	return this->_party.size();
}

bool Party::isPartyFull() const
{
	return this->_partyFull;
}


void Party::setPlayerSession()
{
	for (auto &player : _party)
	{
		if (player.expired())
			continue ;
		player.lock()->setInQueue(false);
		player.lock()->setInSession(true);
	}
}