import { NavLink } from "react-router"

const Error = () => {
	return (
		<div className="body-box">
			<div className="error-box">
				<h2>This page doesn't exist</h2>
				<NavLink to="/" className="button is-large home-button">Back to home</NavLink>
			</div>
		</div>
	)
}

export default Error
