import { Button } from "@allxsmith/bestax-bulma"

const SearchBar = () => {
	return (
		<search>
		<div className="field">
			<p className="control has-icons-right has-icons-left">
				<input
					className="input is-primary"
					type="search"
					id="search_bar"
					name="search_bar"
					minLength={2}
				/>
				<span className="icon is-small is-right">
					<i className="fa-solid fa-magnifying-glass"></i>
				</span>
				<span className="icon is-small is-left">
					<i className="fa-solid fa-sliders"></i>
				</span>
			</p>
			
		</div>
		</search>
	)
}

export default SearchBar