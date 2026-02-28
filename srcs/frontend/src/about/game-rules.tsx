import "./game-rules.css"

const GameRules = () => {
	return (
		<div className="rules-box">
			<h2>Game rules</h2>

			<h3>- Single Player AND Multiplyer rules -</h3>

				<p>You are a <span>soldier lost in a multi-floors maze</span>, your goal is to <span>escape the maze</span> the faster you can, while avoiding death <span>at all cost</span>.</p>

				<p>In order to <span>win</span>, you need to <span>find one of the stairs</span> of each floors, leading to the next floor and then to the end.</p>

				<p>Each floors have a <span>specific design and property</span>, but all of them have an exit/stairs leading to the end/next floor.</p>

				<p>The maze is composed of <span>severals rooms</span>, in some of them nothing to be aware of, but sometime, lots of <span>goblin</span> can trap you in the actual room and you need to <span>defeat them</span> in order to progress in the maze.</p>

				<p><span>Beware</span>, goblins are not friendly at all, they'll <span>attack you</span> if they're able to !</p>

			<h3>- Multiplyer rules -</h3>

				<p>The little soldier you are should also be aware of other player, and progress as fast as they can to <span>escape first</span>, or at least, not be last...</p>

				<p>You cannot wound others soldier, your humanity is better than that, but best rewards are means for the <span>most effective soldier</span>, the little soldier quickness but also courrage against goblins will matter...</p>

				<p>So be fast, courageous, and dont let the other soldier take what you deserve !</p>

			<h3>- Keybinds -</h3>

			<p><span>W</span> - move forward</p>

			<p><span>A</span> - move left</p>

			<p><span>S</span> - move backward</p>

			<p><span>D</span> - move right</p>

			<p><span>SPACE</span> - attack</p>

		</div>
	)
}

export default GameRules
