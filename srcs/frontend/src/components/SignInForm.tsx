import { Button } from "@allxsmith/bestax-bulma"
import InputEmail from "./InputEmail"
import InputPassword from "./InputPassword"

import { Server } from '../server.ts'
import ButtonSubmit from "./ButtonSubmit.tsx"

const SignInForm = () => {
	const server = Server.getInstance();
	const [token, setToken] = useState<string | undefined>(undefined);

	function login(formData) {
		const email = formData.get("email");
		const pwd = formData.get("pwd");

		server.login(email, pwd).then((data) => {
			setToken(data.token);
		})
	}

	return (
		<form action={login}>
		<label for="email">Email</label>
		<br />
		<input
		type="email"
		id="email"
		name="email"
		required
		minlength="3"
		maxlength="80"
		/>

		<br />

		<label for="pwd">Password</label>
		<br />
		<input
		type="password"
		id="pwd"
		name="pwd"
		required
		minlength="8"
		/>
		<br />
		<ButtonSubmit />
		</form>
	)
}

export default SignInForm
