const InputName = ({nameType}) => {
	return (
		<p className="control has-icons-left">
			<input
				className="input"
				type="text"
				id={nameType}
				name={nameType}
				required
				minLength={2}
			/>
			<span className="icon is-small is-left">
				<i className="fas fa-user"></i>
			</span>
		</p>
	)
}

export default InputName