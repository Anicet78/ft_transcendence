import { Button } from "@allxsmith/bestax-bulma"

const friendList = [
	{
		name: 'Alex',
		isPlaying: true,
		id: '1ed'
	},
	{
		name: 'Baptiste',
		isPlaying: false,
		id: '2ab'
	},
	{
		name: 'Coralie',
		isPlaying: false,
		id: '3sd'
	},
	{
		name: 'Denise',
		isPlaying: true,
		id: '4kk'
	},
	{
		name: 'Olivier',
		isPlaying: true,
		id: '5pl'
	},
	{
		name: 'Emilie',
		isPlaying: false,
		id: '6uo'
	}
]

const FriendList = () => {
	return (
		<div>
		<p>
		My friends list:
		</p>
		<ul>
		{friendList.map((friend) => (
			<li key={friend.id}>
			<span>{friend.name}</span>
			{friend.isPlaying && <Button>Spectate</Button>}
			</li>
		))}
		</ul>
		</div>
	)
}

export default FriendList
