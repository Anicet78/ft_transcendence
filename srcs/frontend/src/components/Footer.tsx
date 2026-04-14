import { NavLink } from 'react-router'
 
const authors = [
	{ name: 'agruet',   url: 'https://github.com/Anicet78' },
	{ name: 'jumichel', url: 'https://codeberg.org/jumichel' },
	{ name: 'mprokosc', url: 'https://github.com/mprokosch0' },
	{ name: 'ndabbous', url: 'https://github.com/ndabboussi' },
	{ name: 'tpinton',  url: 'https://github.com/Snak00s' },
]
 
const MyFooter = () => (
	<footer className="site-footer">
		<div className="site-footer__inner">
	
		<div className="site-footer__brand">
			<span className="site-footer__title">
			<span style={{ color: 'var(--stone-100)' }}>Dungeon</span>
			<span style={{ color: 'var(--color-primary)' }}>NoDragon</span>
			</span>
			<span className="site-footer__meta">© 2026 · Piscine July 2024</span>
		</div>
	
		<div className="site-footer__authors">
			{authors.map((a, i) => (
			<span key={a.name}>
				<a href={a.url} target="_blank" rel="noopener noreferrer"
				className="site-footer__link">
				{a.name}
				</a>
				{i < authors.length - 1 && (
				<span className="site-footer__sep"> · </span>
				)}
			</span>
			))}
		</div>
	
		<div className="site-footer__legal">
			<NavLink to="/privacy_policy" className="site-footer__link">
			Privacy Policy
			</NavLink>
			<span className="site-footer__sep"> · </span>
			<NavLink to="/terms_of_service" className="site-footer__link">
			Terms of Service
			</NavLink>
		</div>
	
		</div>
	</footer>
)
 
export default MyFooter
 