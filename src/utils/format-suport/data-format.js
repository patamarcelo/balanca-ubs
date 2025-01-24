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
	// console.log(dateComponents); // 👉️ "06/26/2022"
	// console.log(timeComponents); // 👉️ "04:35:12"

	const [day, month, year] = dateComponents.split("/");
	const [hours, minutes] = timeComponents.split(":");

	const date = new Date(+year, month - 1, +day, +hours, +minutes);
	// console.log("funcDate: ", date); // 👉️ Sun Jun 26 2022 04:35:12
	return date;
};

export const displayDate = (date) => {
	return date?.split("-").reverse().join("/");
};

export const getNextDays = (days) => {
	const nextDays = new Date();
	return nextDays.setDate(nextDays.getDate() + days);
};

export const getNextWeekDays = () => {
	function getWeekBegin() {
		var now = new Date();
		var next = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + (7 - now.getDay())
		);
		return next;
	}
	var firstDay = getWeekBegin();
	var lastDay = firstDay.setDate(firstDay.getDate() + 6);
	const nexSatDay = new Date(lastDay);
	const day =
		nexSatDay.getDate() < 10
			? `0${nexSatDay.getDate()}`
			: nexSatDay.getDate();
	const month = nexSatDay.getMonth() + 1;
	const year = nexSatDay.getFullYear();
	const formatDate = new Date(`${year}-${month}-${day}`);
	return formatDate;
};

export const formatNumber = (data, digits) => {
	return data.toLocaleString(
		"pt-br",
		{
			minimumFractionDigits: digits,
			maximumFractionDigits: digits
		}
	)
}


export default formatDate;
