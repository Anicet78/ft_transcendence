const InputName = ({ label, type, name, value, onChange, placeholder }) => {
	return (
		<div className="field">
			<label htmlFor={name}>{label}</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type={type}
					id={name}
					name={name}
					required
					onChange={onChange}
					minLength={2}
					placeholder={placeholder}
					value={value}
				/>
				<span className="icon is-small is-left">
					<i className="fas fa-user"></i>
				</span>
			</p>
		</div>
	)
}

export default InputName