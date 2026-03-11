import { NavLink } from "react-router"

const GameRules = () => {
	return (
		<div className="rules-box">
			<h2>Game rules</h2>

			<div className="rules-subbox">
				<h3>- Global rules -</h3>

				<p>You are a <span>soldier lost in a multi-floor maze</span>, your goal is to <span>escape the maze</span> as fast as you can, while avoiding death <span>at all costs</span>.</p>

				<p>In order to <span>win</span>, you need to <span>find one of the stairs</span> of each floor, leading to the next floor and then to the end.</p>

				<p>Each floor has a <span>specific design and properties</span>, but all of them have an exit/stairs leading to the end/next floor.</p>

				<p>The maze is composed of <span>several rooms</span>, in some of them there is nothing to be aware of, but sometimes, lots of <span>goblins</span> can trap you in the current room and you need to <span>defeat them</span> in order to progress in the maze.</p>

				<p><span>Beware</span>, goblins are not friendly at all, they'll <span>attack you</span> if they're able to !</p>
			</div>
			<div className="rules-subbox">
				<h3>- Multiplayer rules -</h3>

				<p>The little soldier you are should also be aware of other players, and progress as fast as they can to <span>escape first</span>, or at least, not be the last...</p>

				<p>You cannot wound other soldiers, your humanity is better than that, but the best rewards are meant for the <span>most effective soldier</span>, the little soldier's quickness but also courage against goblins will matter...</p>

				<p>So be fast, courageous, and don't let the other soldiers take what you deserve!</p>
			</div>
			<div className="rules-subbox">
				<h3>- Keybinds -</h3>

				<p><span>W</span> - move forward</p>

				<p><span>A</span> - move left</p>

				<p><span>S</span> - move backward</p>

				<p><span>D</span> - move right</p>

				<p><span>SPACE</span> - attack</p>
			</div>
			<div className="rules-subbox">
				<h3>- XP Guide -</h3>

				<p><span>Win</span> - 10xp</p>

				<p><span>Kill</span> - 1xp</p>

				<p>Level up every 20xp</p>
			</div>
			<div className="rules-subbox">
				<h3>- Compatibility -</h3>

				<p>This game is not playable on mobile and low-end devices</p>
				<p>Consider having a graphics card for a better experience</p>
			</div>
			<NavLink to="/" className="button is-large home-button">Back to home</NavLink>
		</div>
	)
}

export default GameRules
