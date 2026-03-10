import { NavLink } from "react-router";
import { tos_sections } from "./TermsOfServiceContent";

const TermsOfService = () => {
	return (
		<div className="tos-box">
			<div className='tos-title'>
				<h2>Terms of Service (TOS)</h2>
				<p><span>Last updated:</span> March 2026</p>
			</div>
			<div className="tos-container">
				<nav className="tos-toc">
				<h3>Contents</h3>
				<ul>
					{tos_sections.map(section => (
					<li key={section.id}>
						<a href={`#${section.id}`}>{section.title}</a>
					</li>
					))}
				</ul>
				</nav>
				<main className="tos-content">
					{tos_sections.map(section => (
					<section key={section.id} id={section.id}>
						<h3>{section.title}</h3>
						{section.content}
					</section>
					))}
				</main>
			</div>
			<NavLink to="/" className="button is-large home-button">Back to home</NavLink>
		</div>
	);
};

export default TermsOfService;
