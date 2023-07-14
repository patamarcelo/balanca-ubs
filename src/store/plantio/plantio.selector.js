export const selectPlantio = (state) => state.plantio.plantio;

export const selectApp = (state) => state.plantio.app;

export const createDict = (state) => {
	const plantio = state.plantio.app;
	const newArr = plantio.map((data) => {
		const farm = data.plantations[0].plantation.farm_name;
		const operacao = data.inputs[0].input.name;
		const operacaoTipo = data.inputs[0].input.input_type_name;
		const cultura = data.plantations[0].plantation.culture_name;
		const code = data.code;
		const areaSolicitada = data.plantations.map((data) => data.sought_area);
		const areaAplicada = data.plantations.map((data) => data.applied_area);
		const status = data.status;

		const areaTotalSolicitada = areaSolicitada
			.reduce((a, b) => a + b, 0)
			.toFixed(2);

		const areaTotalAplicada = areaAplicada
			.reduce((a, b) => a + b, 0)
			.toFixed(2);

		const percentApp =
			(parseFloat(areaTotalAplicada) / parseFloat(areaTotalSolicitada)) *
			100;
		const saldoAplicar =
			parseFloat(areaTotalSolicitada) - parseFloat(areaTotalAplicada);

		const parcelasSolicitadas = data.plantations.map((data) => {
			const aplicado = data.applied_area === 0 ? false : true;
			return {
				parcela: data.plantation.name,
				area: data.plantation.area,
				variedade: data.plantation.variety_name,
				aplicado: aplicado
			};
		});

		return {
			fazenda: farm,
			app: code,
			status: status,
			progresso: percentApp.toFixed(2),
			operacao: operacao,
			operacaoTipo: operacaoTipo,
			cultura: cultura,
			parcelas: parcelasSolicitadas.sort((a, b) =>
				a.parcela.localeCompare(b.parcela)
			),
			area: areaTotalSolicitada,
			areaAplicada: areaTotalAplicada,
			saldoAplicar: saldoAplicar.toFixed(2),
			date: data.date,
			endDate: data.end_date
		};
	});
	return newArr.sort(
		(a, b) =>
			a.fazenda.localeCompare(b.fazenda) || a.app.localeCompare(b.app)
	);
};

export const onlyFarm = (state) => {
	const plantio = state.plantio.app;
	const onlyfarm = plantio.map((data) => {
		const farms = data.plantations.map((farm) => {
			return farm.plantation.farm_name;
		});
		return farms;
	});
	return [...new Set(onlyfarm.flat())];
};

export const geralAppDetail = (state) => {
	const plantio = state.plantio.app;

	const newArr = plantio
		.filter((data) => data.status === "sought")
		.map((data) => {
			const areaSolicitada = data.plantations.map(
				(data) => data.sought_area
			);
			const areaAplicada = data.plantations.map(
				(data) => data.applied_area
			);

			const farm = data.plantations[0].plantation.farm_name;

			const areaTotalSolicitada = areaSolicitada
				.reduce((a, b) => a + b, 0)
				.toFixed(2);

			const areaTotalAplicada = areaAplicada
				.reduce((a, b) => a + b, 0)
				.toFixed(2);

			const saldoAplicar =
				parseFloat(areaTotalSolicitada) - parseFloat(areaTotalAplicada);

			const cultura = data.plantations[0].plantation.culture_name;

			return {
				fazenda: farm,
				cultura: cultura,
				area: areaTotalSolicitada,
				aplicado: areaTotalAplicada,
				saldo: saldoAplicar.toFixed(2)
			};
		});

	const geralApp = newArr.reduce(
		(result, value) => {
			const { area, aplicado, saldo } = value;

			result.area += Number(area);
			result.aplicado += Number(aplicado);
			result.saldo += Number(saldo);

			return result;
		},
		{
			area: 0,
			aplicado: 0,
			saldo: 0
		}
	);

	const fazendasApp = newArr.reduce((result, value) => {
		const { area, aplicado, saldo, fazenda, cultura } = value;
		if (!result[fazenda]) {
			result[fazenda] = {
				area: Number(area),
				aplicado: Number(aplicado),
				saldo: Number(saldo)
			};
		} else {
			result[fazenda].area += Number(area);
			result[fazenda].aplicado += Number(aplicado);
			result[fazenda].saldo += Number(saldo);
		}

		if (!result[fazenda][cultura]) {
			result[fazenda][cultura] = Number(saldo);
		} else {
			result[fazenda][cultura] += Number(saldo);
		}
		return result;
	}, {});

	return {
		geral: geralApp,
		fazendas: fazendasApp
	};
};
