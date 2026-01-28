const InputName = ({label, nameType}) => {
	return (
		<div className="field">
			<label htmlFor="text">{label}</label>
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
		</div>
	)
}

export default InputName