const InputElement = (elmtType: string) => {
	return (
		<input
			className="input"
			type={elmtType}
			id={elmtType}
			name={elmtType}
			required
			minLength={3}
			maxLength={80}
		/>
	)
}

export default InputElement
