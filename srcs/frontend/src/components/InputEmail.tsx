const InputEmail = ({ label, name, value, onChange, placeholder }) => {
	return (
		<div className="field">
			<label htmlFor={name}>{label}</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type="email"
					id={name}
					name={name}
					required
					minLength={3}
					maxLength={80}
					onChange={onChange}
					placeholder={placeholder}
					value={value}
				/>
				<span className="icon is-small is-left">
					<i className="fas fa-envelope"></i>
				</span>
			</p>
		</div>
	)
}

export default InputEmail