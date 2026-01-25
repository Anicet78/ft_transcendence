import { Field, Control, Input } from '@allxsmith/bestax-bulma';

const InputPassword = () => {
	return (
		<Field label="Password">
			<Control
				hasIconsLeft
				iconLeft={{ name: 'lock' }}
			>
			<Input type='password' placeholder="your password" />
			</Control>
		</Field>
	)
}

export default InputPassword
