#ifndef PLAYER_HPP

# define PLAYER_HPP

# include "Map.hpp"

typedef struct PerSocketData
{
    std::string							playerId;
    std::string							pseudo;
    std::string							room; //room is designing an appartenance at a game room, with all of the other players of the session
	std::string							groupId; //group is is for the group with you launch the game (before matchmaking)
	int									groupSize;//size of the group
	int									sessionSize;
    std::map<std::string, std::string>	jsonMsg;
} PerSocketData;

class Player
{
	private:
		std::string									_uid;
		int											_numPlayer;
		int											_sessionSize; // size of the session requested
		int											_partySize; //size of the group
		std::string									_partyId; //party is for the group with you launch the game with (before matchmaking)
		std::string									_name;
		bool										_inQueue;
		bool										_inSession;
		bool										_launched;
		bool										_connected;
		bool										_reConnected;
		bool										_finished;
		bool										_hasWin;
		bool										_died;
		int											_finalRanking;
		char										_exit;
		std::chrono::_V2::steady_clock::time_point	_timeDeconnection;
		uWS::WebSocket<false, true, PerSocketData>	*_ws;

	//player pos
		float		_x;
		float		_y;
		int			_floor;

	//pos in map
		quadList	_node;
		quadList	_prev_node;
		quadList	_startNode;

		int			_startPos;

	//anim
		int			_anim;
		int			_last_dir;

	//player stat
		int			_hp;
		int			_atk;
		bool		_isInvinsible;
		std::chrono::_V2::steady_clock::time_point	_timeInvincible;
		int			_def;
	//wall hitbox
		FRect		_wallHitBox;
		HitBox		_box;

	//atk state
		bool		_isAttacking;
		int			_atkFrame;
		std::chrono::_V2::steady_clock::time_point	_timeAttack;

	//nbr kill
		int			_kills;
	public:
		Player(std::string uid, int partySize, std::string partyId, std::string name,
				int sessionSize, uWS::WebSocket<false, true, PerSocketData> *ws);
		~Player();

	//getter
		std::string	getUid(void) const;
		std::string	getName(void) const;
		Room		getRoom(void) const;
		quadList	getNode(void) const;
		quadList	getPrevNode(void) const;
		quadList	getStartNode(void) const;
		bool		getFinished(void) const;
		int			getSessionSize(void) const;
		bool		HasWin(void) const;
		bool		getDied(void) const;
		bool		isConnected(void) const;
		bool		isReConnected(void) const;
		int			getFinalRanking(void) const;
		char		getExit(void) const;
		int			getGroupSize() const;
		int			getAnim(void) const;
		std::string	getPartyId(void) const;
		bool		isInQueue(void)	const;
		bool		isInSession(void) const;
		bool		isLaunched(void) const;
		uWS::WebSocket<false, true, PerSocketData> *getWs(void) const;

		float		getX(void) const;
		float		getY(void) const;
		int			getFloor(void) const;

		int			getStartPos(void) const;

		int			getHp(void) const;
		int			getAtk(void) const;
		bool		checkInvinsibleFrame(void) const;
		int			getAtkFrame(void) const;
		int			getDef(void) const;
		int			getLastDir(void) const;
		FRect		&getWallHitBox(void);
		Room		&getRoomRef(void);
		HitBox		&getHitBox(void);
		int			getKills(void) const;
		double		getTimeDeconnection(void) const;
		double		getTimeInvincible(void) const;
		double		getTimeAttack(void) const;

	//setter
		void		setWs(uWS::WebSocket<false, true, PerSocketData> *ws);
		void		setConnexion(bool c);
		void		setReconnexion(bool c);
		void		setLaunched(bool flag);
		void		setFinished(bool flag);
		void		setHasWin(bool flag);
		void		setDied(bool flag);
		void		setFinalRanking(int place);
		void		setExit(char c);
		void		setNode(const quadList &node);
		void		setPrevNode(const quadList &node);
		void		setStartNode(const quadList &node);
		void		setPos(float x, float y);
		void		incrementFloor(void);

		void		setStartPos(int pos);

		void		setHp(int hp);
		void		setAtk(int atk);
		void		setAtkFrame(int frame);
		void		setDef(int def);
		void		setWallHitBox(void);
		void		setInQueue(bool flag);
		void		setInSession(bool flag);
		void		setAnim(int anim);
		void		setLastDir(int dir);

		void		addKills(void);
		void		resetTimeAttack(void);
		void		startInvinsibleFrame(void);
		void		endInvinsibleFrame(void);

	//action
		void		findP(void);

		void		attack(void);
		bool		getIsAttacking(void) const;
		void		endAttacking(void);

		void		updateAnim(std::string const &req);
		void		move(std::map<std::string, std::string> &req);
		void		takeDamage(int amount);
		void		heal(int amount);

		void		dieAction(void);
};

#endif