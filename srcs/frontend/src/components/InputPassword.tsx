const InputPassword = () => {
	return (
		<div className="field">
			<label htmlFor="password">Pasword</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type="password"
					id="pwd"
					name="pwd"
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
