import { Field, Control, Input } from '@allxsmith/bestax-bulma';

const InputEmail = () => {
	return (
		<Field label="Email">
		<Control
		hasIconsLeft
		iconLeft={{ name: 'envelope' }}
		>
		<Input type='email' placeholder="example@mail.com" />
		</Control>
		</Field>
	)
}

export default InputEmail
