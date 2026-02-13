const InputPassword = ({ label, type, name, value, onChange, placeholder }) => {
	return (
		<div className="field">
			<label htmlFor={name}>{label}</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type={type}
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required
					minLength={8}
				/>
				<span className="icon is-small is-left">
					<i className="fas fa-lock"></i>
				</span>
			</p>
		</div>
	)
}

export default InputPassword
