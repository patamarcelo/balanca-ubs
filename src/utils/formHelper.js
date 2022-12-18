export const hanlderHelperText = (type, value) => {
	const defaultValue = "";
	switch (type) {
		case "number":
			if (value) {
				return Number(value)?.toLocaleString("pt-BR") + " Kg";
			} else {
				return defaultValue;
			}
		default:
			return defaultValue;
	}
};
