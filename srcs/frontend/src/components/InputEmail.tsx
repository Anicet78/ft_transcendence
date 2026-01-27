const InputEmail = () => {
	return (
		<div className="field">
        	<label htmlFor="email">Email</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type="email"
					id="email"
					name="email"
					required
					minLength={3}
					maxLength={80}
				/>
				<span className="icon is-small is-left">
					<i className="fas fa-envelope"></i>
				</span>
        	</p>
		</div>
	)
}

export default InputEmail
