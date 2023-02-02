export const selectTruckLoads = (state) => state.truckLoads.truckLoads;

export const selectTruckSendSeed = (state) => {
	const dataLoad = state.truckLoads.truckLoads;
	return dataLoad.filter((data) =>
		data.mercadoria.toLowerCase().includes("plantio")
	);
};
export const selectTruckLoadsOnWork = (unidadeOp) => (state) => {
	const dataLoad = state.truckLoads.truckLoads;
	const unidadeOpFiltered = unidadeOp ? unidadeOp : "ubs";
	return dataLoad
		.filter((data) => data.pesoBruto === "" || data.tara === "")
		.filter((data) => data.unidadeOp === unidadeOpFiltered);
};

export const selectTruOnWork = (state) => {
	const dataLoad = state.truckLoads.truckLoads;
	return dataLoad.filter((data) => data.pesoBruto === "" || data.tara === "");
};

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
		return {
			...data,
			entrada: formatData,
			saida: formatDataSaida
		};
	});
	return fd;
};

export const selectTrucksCarregando = (unidadeOp) => (state) => {
	const dataLoad = state.truckLoads.truckLoads.filter(
		(data) =>
			data.tipo === "carregando" &&
			(data.pesoBruto === "" || data.tara === "") &&
			data.unidadeOp === unidadeOp
	);
	return Object.keys(dataLoad).length;
};

export const selectTrucksDescarregando = (unidadeOp) => (state) => {
	const dataLoad = state.truckLoads.truckLoads.filter(
		(data) =>
			data.tipo === "descarregando" &&
			(data.pesoBruto === "" || data.tara === "") &&
			data.unidadeOp === unidadeOp
	);
	return Object.keys(dataLoad).length;
};

export const selectTruckOnID = (id) => (state) => {
	const newId = state.truckLoads.truckLoads.filter(
		(data) => data.id === id
	)[0];
	return newId;
};
