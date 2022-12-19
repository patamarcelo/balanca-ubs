export const selectTruckLoads = (state) => state.truckLoads.truckLoads;

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

export const selectTruckLoadsFormatData = (state) => {
	const dataLoad = state.truckLoads.truckLoads;
	const fd = dataLoad.map((data) => {
		const formatData = formatDate(data.entrada);
		const formatDataSaida = formatDate(data.saida);
		console.log(formatData);
		return {
			...data,
			entrada: formatData,
			saida: formatDataSaida
		};
	});
	return fd;
};

export const selectTrucksCarregando = (state) => {
	const dataLoad = state.truckLoads.truckLoads.filter(
		(data) => data.tipo === "carregando"
	);
	return Object.keys(dataLoad).length;
};

export const selectTrucksDescarregando = (state) => {
	const dataLoad = state.truckLoads.truckLoads.filter(
		(data) => data.tipo === "descarregando"
	);
	return Object.keys(dataLoad).length;
};
