import { useState } from "react"

const InputPassword = ({label, id}) => {
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [passwordError, setPasswordError] = useState(false)

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}
	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value)
	}
	const handlePasswordValidation = () => {
		if (password !== confirmPassword)
			setPasswordError(true)
		else
			setPasswordError(false)
	}
	return (
		<>
			<div className="field">
			<label htmlFor="password">{label}</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type="password"
					id={id}
					name="pwd"
					value={password}
					onChange={handlePasswordChange}
					onBlur={handlePasswordValidation}
					required
					minLength={8}
				/>
				<span className="icon is-small is-left">
					<i className="fas fa-lock"></i>
				</span>
			</p>
			</div>
			<div className="field">
			<label htmlFor="password">Confirm password</label>
			<p className="control has-icons-left">
				<input
					className="input"
					type="password"
					id="confirm_pwd"
					name="confirm_pwd"
					value={confirmPassword}
					onChange={handleConfirmPasswordChange}
					onBlur={handlePasswordValidation}
					required
					minLength={8}
				/>
				<span className="icon is-small is-left">
					<i className="fas fa-lock"></i>
				</span>
			</p>
			</div>
			{passwordError && <span>Password don't match</span>}
		</>
	)
}

export default InputPassword
