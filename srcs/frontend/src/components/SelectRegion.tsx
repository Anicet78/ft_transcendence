const SelectRegion = () => {
	return (
		<div className="field">
			<label htmlFor="region">Region</label>
			<div className="control has-icons-left">
				<div className="select">
					<div className="icon is-small is-left">
					<i className="fas fa-globe"></i>
					</div>
					<select aria-label="region selection" id='region' name='region' required>
					<option defaultValue='default'>Select your region</option>
					<option value='EU'>EU</option>
					<option value='NA'>NA</option>
					<option value='SAM'>SAM</option>
					<option value='MENA'>MENA</option>
					<option value='OCE'>OCE</option>
					<option value='APAC'>APAC</option>
					<option value='SSA'>SSA</option>
					</select>
				</div>
			</div>
		</div>
	)
}

export default SelectRegion