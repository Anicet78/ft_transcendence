import { NavLink } from 'react-router';
import { sections } from './privacyPolicyContent';

const Privacy = () => {
	return (
		<div className='privacy-box'>
			<div className='privacy-title'>
				<h2>Privacy policy</h2>
				<p><span>Last updated:</span> March 2026</p>
			</div>
			<div className="privacy-container">
				<nav className="privacy-toc">
				<h3>Contents</h3>
				<ul>
					{sections.map(section => (
					<li key={section.id}>
						<a href={`#${section.id}`}>{section.title}</a>
					</li>
					))}
				</ul>
				</nav>
				<main className="privacy-content">
					{sections.map(section => (
					<section key={section.id} id={section.id}>
						<h3>{section.title}</h3>
						{section.content}
					</section>
					))}
				</main>
			</div>
			<NavLink to="/" className="button is-large home-button">Back to home</NavLink>
		</div>
	)
}

export default Privacy