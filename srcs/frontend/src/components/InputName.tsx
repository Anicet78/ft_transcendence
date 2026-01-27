const InputName = () => {
	return (
		<p className="control has-icons-left">
			<input
				className="input"
				type="text"
				id="name"
				name="name"
				required
				minLength={8}
			/>
			<span className="icon is-small is-left">
				<i className="fas fa-user"></i>
			</span>
		</p>
	)
}

export default InputName