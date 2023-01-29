const formatDate = (entrada) => {
	if (entrada) {
		const newDate = new Date(
			entrada.seconds * 1000 + entrada.nanoseconds / 1000000
		);

		const date = newDate.toISOString().split("T")[0];
		const atTime = newDate.toLocaleTimeString().slice(0, 5);
		const [year, month, day] = date.split("-");
		const formatDate = [day, month, year].join("/");
		const dateF = `${formatDate} - ${atTime}`;
		return dateF;
	}

	return "-";
};

export const newDateArr = (dataFor) => {
	console.log("Data a ser formatada: ", dataFor);
	const str = dataFor;

	const [dateComponents, timeComponents] = str.split("-");
	console.log(dateComponents); // 👉️ "06/26/2022"
	console.log(timeComponents); // 👉️ "04:35:12"

	const [day, month, year] = dateComponents.split("/");
	const [hours, minutes] = timeComponents.split(":");

	const date = new Date(+year, month - 1, +day, +hours, +minutes);
	console.log("funcDate: ", date); // 👉️ Sun Jun 26 2022 04:35:12
	return date;
};

export default formatDate;
