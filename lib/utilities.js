valueInArray = function(col, value) {
	let valueIndex = col.findIndex(element => {
		return element === value;
	});
	return valueIndex >= 0;
};