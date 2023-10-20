import { getNextDays } from "../../utils/format-suport/data-format";

export const selectPlantio = (state) => state.plantio.plantio;

export const selectApp = (state) => state.plantio.app;

export const selectSafraCiclo = (state) => state.plantio.safraCiclo;

export const selecPlantioMapAll = (state) => state.plantio.plantioMapAll;

export const selecPluvi = (state) => state.plantio.pluvi;

export const selecPluviFormat = (state) => {
	const data = state.plantio.pluvi;
	const formData = data.map((data) => {
		return {
			fazenda: data.pluviometer.farm.name,
			fazendaId: data.pluviometer.farm.id,
			date: data.date.split("T")[0],
			value: data.quantity
		};
	});
	console.log(formData);
	return formData;
};

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

		const operacaoTipoFil = data.inputs.filter(
			(input) => input.input.input_type_name === "Operação"
		);
		const opTioAp = operacaoTipoFil[0]?.input?.input_type_name;
		const opTioApName = operacaoTipoFil[0]?.input?.name;

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
				id_plantation: data.plantation.id,
				area: data.plantation.area,
				variedade: data.plantation.variety_name,
				cultura: data.plantation.culture_name,
				aplicado: aplicado,
				dataPlantio: data.plantation.date
			};
		});

		const insumosSolicitados = data.inputs.map((data) => {
			return {
				insumo: data.input.name,
				tipo: data.input.input_type_name,
				quantidade: data.sought_quantity
					.toFixed(2)
					.toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}),
				dose: data.sought_dosage_value.toFixed(3)
			};
		});

		const progressos = data.progresses.map((data) => {
			const areaApliacada = data.area;
			const plantacoesAplicadas = data.plantations.map((data) => {
				return {
					idPlantacao: data.plantation_id,
					areaAplicadaPlantacao: data.area
				};
			});
			return {
				areaApliacada: areaApliacada,
				plantacoesAplicadas
			};
		});

		return {
			fazenda: farm,
			app: code,
			status: status,
			progresso: percentApp.toFixed(2),
			operacao: opTioApName ? opTioApName : "Sem Operação Informada",
			operacaoTipo: opTioAp ? opTioAp : "Sem Operação Informada",
			cultura: cultura,
			parcelas: parcelasSolicitadas.sort((a, b) =>
				a.parcela.localeCompare(b.parcela)
			),
			insumos: insumosSolicitados,
			area: areaTotalSolicitada,
			areaAplicada: areaTotalAplicada,
			saldoAplicar: saldoAplicar.toFixed(2),
			date: data.date,
			endDate: data.end_date,
			progressos: progressos
		};
	});
	return newArr.sort(
		(a, b) =>
			a.fazenda.localeCompare(b.fazenda) || a.app.localeCompare(b.app)
	);
};

export const createDictFarmBox = (state) => {
	const plantio = state.plantio.appFarmBox;
	const newArr = plantio.map((data) => {
		const farm = data.plantations[0].plantation.farm_name;
		const operacao = data.inputs[0].input.name;
		const operacaoTipoFil = data.inputs.filter(
			(input) => input.input.input_type_name === "Operação"
		);
		const opTioAp = operacaoTipoFil[0]?.input?.input_type_name;
		const opTioApName = operacaoTipoFil[0]?.input?.name;

		const cultura = data.plantations[0].plantation.culture_name;
		const code = data.code;
		const idCode = data.id;

		const areaSolicitada = data.plantations.map((data) => data.sought_area);
		const areaAplicada = data.plantations.map((data) => data.applied_area);
		const status = data.status;
		const closedDate = data?.closed_date?.split("T")[0];
		const initialAppDateAplicada =
			data?.first_movimentation_date?.split("T")[0];
		const finalAppDateAplicada =
			data?.last_movimentation_date?.split("T")[0];

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
				id_plantation: data.plantation.id,
				area: data.plantation.area,
				variedade: data.plantation.variety_name,
				cultura: data.plantation.culture_name,
				aplicado: aplicado,
				dataPlantio: data.plantation.date,
				safra: data.plantation.harvest_name,
				ciclo: data.plantation.cycle
			};
		});

		const insumosSolicitados = data.inputs.map((data) => {
			return {
				insumo: data.input.name,
				tipo: data.input.input_type_name,
				quantidade: data.sought_quantity
					.toFixed(2)
					.toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}),
				dose: data.sought_dosage_value.toFixed(3)
			};
		});

		const progressos = data.progresses.map((data) => {
			const areaApliacada = data.area;
			const plantacoesAplicadas = data.plantations.map((data) => {
				return {
					idPlantacao: data.plantation_id,
					areaAplicadaPlantacao: data.area
				};
			});
			return {
				areaApliacada: areaApliacada,
				plantacoesAplicadas
			};
		});

		// console.log(progressos);

		return {
			fazenda: farm,
			app: code,
			idCode,
			status: status,
			progresso: percentApp.toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}),
			operacao: opTioApName ? opTioApName : "Sem Operação Informada",
			operacaoTipo: opTioAp ? opTioAp : "Sem Operação Informada",
			cultura: cultura,
			parcelas: parcelasSolicitadas.sort((a, b) =>
				a.parcela.localeCompare(b.parcela)
			),
			insumos: insumosSolicitados,
			area: areaTotalSolicitada,
			areaAplicada: areaTotalAplicada,
			saldoAplicar: saldoAplicar.toFixed(2),
			progressos,
			date: data.date,
			endDate: data.end_date,
			closedDate,
			initialAppDateAplicada,
			finalAppDateAplicada
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

export const geralAppDetail = (showFutureApps, days) => (state) => {
	const plantio = state.plantio.app;

	const newArr = plantio
		.filter((data) => data.status === "sought")
		.filter((data) =>
			!showFutureApps
				? new Date(data.date) < getNextDays(days)
				: new Date(data.date) < new Date("2031-10-17")
		)
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
