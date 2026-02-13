import { Button } from "@allxsmith/bestax-bulma"
import "./SearchBar.css"

const SearchBar = () => {

	return (
		<form action="/" method="get" className="search_bar">
				<label htmlFor="header-search">
					<span className="visually-hidden">Search blog posts</span>
				</label>
				<input
					type="text"
					id="header-search"
					placeholder="Search user profile"
					name="header-search" 
				/>
				<Button type="submit" size="small" className="search_button">
					<i className="fa-solid fa-magnifying-glass"></i>
				</Button>
		</form>
	)
}

export default SearchBar