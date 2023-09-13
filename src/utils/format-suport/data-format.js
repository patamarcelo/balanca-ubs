export const formatDate = (entrada) => {
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

export const fomartNewDate = (data) => {
	const year = data.toLocaleString("Default", { year: "numeric" });
	const month = data.toLocaleString("Default", { month: "2-digit" });
	const day = data.toLocaleString("Default", { day: "2-digit" });
	const hour = data.toLocaleString("Default", { hour: "2-digit" });
	const minute = data.toLocaleString("Default", { minute: "2-digit" });
	const format_minute = Number(minute) < 10 ? `0${minute}` : minute;
	return `${day}/${month}/${year} - ${hour}:${format_minute}`;
};

export const newDateArr = (dataFor) => {
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

export const displayDate = (date) => {
	return date.split("-").reverse().join("/");
};

export default formatDate;
