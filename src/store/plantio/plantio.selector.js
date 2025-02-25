import { getNextDays } from "../../utils/format-suport/data-format";
import { createSelector } from 'reselect';


export const selectPlantio = (state) => state.plantio.plantio;

export const selectPlantioDoneResume = (filterVar) => (state) => {
	let data = [];
	if (filterVar === "Todas") {
		data = state.plantio.plantio;
	} else {
		data = state.plantio.plantio.filter(
			(data) => data.dados.cultura === filterVar
		);
	}
	const filterByFarm = data.reduce((acc, curr) => {
		if (curr.dados.plantio_finalizado === true) {
			if (
				acc.filter(
					(data) =>
						data.status === "plantado" &&
						data.cultura === curr.dados.cultura &&
						data.fazenda === curr.fazenda
				).length === 0
			) {
				const objToAdd = {
					fazenda: curr.fazenda,
					area: curr.dados.area_colheita,
					cultura: curr.dados.cultura,
					status: "plantado"
				};
				acc.push(objToAdd);
			} else {
				const findIndexOf = (e) =>
					e.cultura === curr.dados.cultura &&
					e.status === "plantado" &&
					e.fazenda === curr.fazenda;
				const getIndex = acc.findIndex(findIndexOf);
				acc[getIndex]["area"] += curr.dados.area_colheita;
			}
		} else {
			if (
				acc.filter(
					(data) =>
						data.status === "planejado" &&
						data.cultura === curr.dados.cultura &&
						data.fazenda === curr.fazenda
				).length === 0
			) {
				const objToAdd = {
					fazenda: curr.fazenda,
					area: curr.dados.area_colheita,
					cultura: curr.dados.cultura,
					status: "planejado"
				};
				acc.push(objToAdd);
			} else {
				const findIndexOf = (e) =>
					e.cultura === curr.dados.cultura &&
					e.status === "planejado" &&
					e.fazenda === curr.fazenda;
				const getIndex = acc.findIndex(findIndexOf);
				acc[getIndex]["area"] += curr.dados.area_colheita;
			}
		}

		return acc;
	}, []);

	const onlyPlantedFarm = filterByFarm
		.filter((data) => data.status === "plantado")
		.reduce(
			(acc, curr) => {
				if (
					acc.filter((data) => data.fazenda === curr.fazenda)
						.length === 0
				) {
					const objToAdd = {
						fazenda: curr.fazenda,
						area: curr.area
					};
					acc.push(objToAdd);
				} else {
					const findIndexOf = (e) => e.fazenda === curr.fazenda;
					const getIndex = acc.findIndex(findIndexOf);
					acc[getIndex]["area"] += curr.area;
				}

				return acc;
			},

			[]
		);

	const totalPlan = data.reduce((acc, curr) => {
		if (!acc[curr.fazenda]) {
			acc[curr.fazenda] = curr.dados.area_colheita;
		} else {
			acc[curr.fazenda] += curr.dados.area_colheita;
		}
		return acc;
	}, {});
	return {
		allFarm: filterByFarm,
		planted: onlyPlantedFarm,
		totalPlan: totalPlan
	};
};

export const selecPlantioCharts = (filterVar) => (state) => {
	let data = [];
	if (filterVar === "Todas") {
		data = state.plantio.plantio;
	} else {
		data = state.plantio.plantio.filter(
			(data) => data.dados.cultura === filterVar
		);
	}
	const totalPlantado = data
		.filter((data) => data.dados.plantio_finalizado === true)
		.reduce((acc, curr) => curr.dados.area_colheita + acc, 0);
	const totalAberto = data
		.filter((data) => data.dados.plantio_finalizado === false)
		.reduce((acc, curr) => curr.dados.area_colheita + acc, 0);
	const dataConsoli = [
		{
			id: "Plantado",
			label: "Plantado",
			value: totalPlantado.toFixed(2),
			color: "#e8a838",
			formattedValue: totalPlantado.toFixed(2) + " Ha",
			percen: (totalPlantado / (totalAberto + totalPlantado)) * 100
		},
		{
			id: "Planejado",
			label: "Planejado",
			value: totalAberto.toFixed(2),
			color: "hsl(123, 70%, 50%)",
			percen: (totalAberto / (totalAberto + totalPlantado)) * 100
		}
	];

	return dataConsoli;
};

export const selectPlantioVarsChart = (state) => {
	const data = state.plantio.plantio.filter(
		(data) => data.dados.plantio_finalizado === true
	);
	const resumeData = data.reduce((acc, curr) => {
		if (
			acc.filter((data) => data.id === curr.dados.variedade).length === 0
		) {
			const objToAdd = {
				id: curr.dados.variedade,
				area: curr.dados.area_colheita,
				cultura: curr.dados.cultura
			};
			acc.push(objToAdd);
		} else {
			const findIndexOf = (e) => e.id === curr.dados.variedade;
			const getIndex = acc.findIndex(findIndexOf);
			acc[getIndex]["area"] += curr.dados.area_colheita;
		}

		return acc;
	}, []);

	const resumeDataCult = data.reduce((acc, curr) => {
		if (!acc[curr.dados.cultura]) {
			acc[curr.dados.cultura] = curr.dados.area_colheita;
		} else {
			acc[curr.dados.cultura] += curr.dados.area_colheita;
		}

		return acc;
	}, {});

	const formObj = Object.entries(resumeDataCult);
	const result = formObj.map((data) => {
		return { id: data[0], label: data[0], value: data[1] };
	});

	return { result: result, data: resumeData };
};

export const selectApp = (state) => state.plantio.app;

export const selectSafraCiclo = (state) => state.plantio.safraCiclo;

export const selecPlantioMapAll = (state) => state.plantio.plantioMapAll;

export const selecCalendarArray = (filterVar) => (state) => {
	const onlyFilteredFarm = state.plantio.plantioCalendarDone.map(
		(data) => data.talhao__fazenda__nome
	);
	const dupFarm = [...new Set(onlyFilteredFarm)];
	let data = [];
	if (filterVar === "Todas") {
		data = state.plantio.plantioCalendarDone;
	} else {
		data = state.plantio.plantioCalendarDone.filter(
			(data) => data.variedade__cultura__cultura === filterVar
		);
	}
	// const data = state.plantio.plantioCalendarDone;
	const newArr = data.map((data) => {
		let newName = null;
		if (data.variedade__cultura__cultura === "Feijão") {
			newName = data.variedade__variedade.split(" ").slice(1).join(" ");
		} else {
			newName = data.variedade__cultura__cultura;
		}
		return { ...data, newName: newName };
	});
	const reduCArr = newArr.reduce((acc, curr) => {
		const filterProps = acc.filter(
			(data) =>
				data.cultura === curr.newName &&
				data.fazenda === curr.talhao__fazenda__nome &&
				data.month === curr.month &&
				data.year === curr.year
		);
		if (filterProps.length === 0) {
			const objToAdd = {
				cultura: curr.newName,
				fazenda: curr.talhao__fazenda__nome,
				month: curr.month,
				year: curr.year,
				ciclo: curr.ciclo__ciclo,
				area: curr.area_total
			};
			acc.push(objToAdd);
		} else {
			const findIndexOf = (data) =>
				data.cultura === curr.newName &&
				data.fazenda === curr.talhao__fazenda__nome &&
				data.month === curr.month &&
				data.year === curr.year;
			const getIndex = acc.findIndex(findIndexOf);
			acc[getIndex]["area"] += curr.area_total;
		}
		return acc;
	}, []);

	const headerTable = reduCArr.reduce((acc, curr) => {
		const filtOpt = acc.filter(
			(data) =>
				data.cultura === curr.cultura &&
				data.month === curr.month &&
				data.year === curr.year
		);
		if (filtOpt.length === 0) {
			const objToAdd = {
				cultura: curr.cultura,
				month: curr.month,
				year: curr.year,
				area: curr.area
			};
			acc.push(objToAdd);
		} else {
			const findIndexOf = (data) =>
				data.cultura === curr.cultura &&
				data.month === curr.month &&
				data.year === curr.year;
			const getIndex = acc.findIndex(findIndexOf);
			acc[getIndex]["area"] += curr.area;
		}
		return acc;
	}, []);
	const totalValue = headerTable.reduce((acc, curr) => (acc += curr.area), 0);
	const addTotalHeader = [
		...headerTable,
		{ cultura: "Totais", month: 13, area: totalValue, year: 2100 }
	];

	return {
		headerTable: addTotalHeader,
		table: reduCArr,
		farms: dupFarm.sort((a, b) =>
			a.replace("Projeto", "").localeCompare(b.replace("Projeto", ""))
		)
	};
};

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
	return formData;
};

export const createDict = (state) => {
	const plantio = state.plantio.app;
	const newArr = plantio.map((data) => {
		const farm = data.plantations[0].plantation.farm_name;
		const farm_id = data.plantations[0].plantation.farm.id;
		const operacao = data.inputs[0].input.name;
		const operacaoTipo = data.inputs[0].input.input_type_name;
		const cultura = data.plantations[0].plantation.culture_name;
		const planned_cult = data.plantations[0].plantation.planned_culture_name;
		const code = data.code;
		const areaSolicitada = data.plantations.map((data) => data.sought_area);
		const areaAplicada = data.plantations.map((data) => data.applied_area);
		const status = data.status;
		const observations = data.observations

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
				area: data.sought_area,
				areaAplicada: data.applied_area,
				variedade: data.plantation.variety_name,
				cultura: data.plantation.culture_name ||  data.plantation.planned_culture_name,
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
			fazenda_box_id: farm_id,
			app: code,
			status: status,
			observations: observations,
			progresso: percentApp.toFixed(2),
			operacao: opTioApName ? opTioApName : "Sem Operação Informada",
			operacaoTipo: opTioAp ? opTioAp : "Sem Operação Informada",
			cultura: cultura || planned_cult,
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
		const areaSolicitadas = data.plantations.map((data) => ({
			area: data.sought_area,
			idFarm: data.plantation.id
		}));
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

		const parcelasSolicitadas = data.plantations.map((dataMap) => {
			const aplicado = dataMap.applied_area === 0 ? false : true;
			const appInitial = data.progresses.map((progData) =>
				progData.plantations.map((dataP) => {
					return {
						date: progData.date,
						farmInit: dataP.plantation_id,
						areaInit: dataP.area
					};
				})
			);
			let filteredApp = [];
			if (appInitial.length > 0) {
				filteredApp = appInitial
					.flat()
					.filter(
						(data) =>
							data.farmInit === dataMap.plantation.id &&
							data.areaInit > 0
					)
					.sort((a, b) => a.date - b.date);
			}
			const getDates = () => {
				if (filteredApp.length > 0) {
					return filteredApp.map((data) => ({
						...data,
						date: data.date.split("T")[0]
					}));
				}
				return [{ date: " - " }];
			};
			return {
				parcela: dataMap.plantation.name,
				id_plantation: dataMap.plantation.id,
				area: dataMap.plantation.area,
				variedade: dataMap.plantation.variety_name,
				cultura: dataMap.plantation.culture_name,
				aplicado: aplicado,
				dataPlantio: dataMap.plantation.date,
				safra: dataMap.plantation.harvest_name,
				ciclo: dataMap.plantation.cycle,
				initialAppDateAplicada: getDates()[0]["date"],
				finalAppDateAplicada: getDates().at(-1)["date"]
			};
		});

		const insumosSolicitados = data.inputs.map((data) => {
			return {
				insumo: data.input.name,
				insumo_id: data.input.id,
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
			const equipment = data.equipment.name;
			const areaApliacada = data.area;
			const plantacoesAplicadas = data.plantations.map((data) => {
				return {
					equipment: equipment,
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
			areaSolicitada: areaSolicitadas,
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


// Input selector to get plantio data
const getPlantioApp = (state) => state.plantio.app || []; // Default to an empty array

// Memoized selector to get unique farm names
export const onlyFarmSelector = createSelector(
	[getPlantioApp],
	(plantio) => {
		// Extract farm names from plantio data
		const onlyfarm = plantio.map((data) => {
			const farms = data.plantations.map((farm) => {
				return farm.plantation.farm_name;
			});
			return farms;
		});

		// Return unique farm names
		return [...new Set(onlyfarm.flat())];
	}
);

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
		.filter(
			(data) =>
				data?.inputs[0]?.input?.name?.trim() !== "Colheita de Grãos"
		)
		.filter((data) =>
			!showFutureApps
				? new Date(data.date) < getNextDays(days)
				: new Date(data.date) < new Date("2031-10-17")
		)
		.map((data) => {
			// console.log('dataApplications: : ', data)
			const cultura = data.plantations[0].plantation.culture_name;
			const planned_cult = data.plantations[0].plantation.planned_culture_name;
			const farm = data.plantations[0].plantation.farm_name;

			// #AREA GERAL
			const areaSolicitada = data.plantations.map(
				(data) => data.sought_area
			);
			const areaTotalSolicitada = areaSolicitada
				.reduce((a, b) => a + b, 0)
				.toFixed(2);

			const areaAplicada = data.plantations.map(
				(data) => data.applied_area
			);
			const areaTotalAplicada = areaAplicada
				.reduce((a, b) => a + b, 0)
				.toFixed(2);

			const saldoAplicar =
				parseFloat(areaTotalSolicitada) - parseFloat(areaTotalAplicada);



			//AREA OPERACAO
			let totalSaldoAplicacao = 0
			let totalSaldoSolidos = 0
			let totalSaldosLiquidos = 0
			if (data.inputs.length === 1) {
				const areaSolicitadaOperacao = data.plantations.map(
					(data) => data.sought_area
				);
				const areaTotalSolicitadaOperacao = areaSolicitadaOperacao
					.reduce((a, b) => a + b, 0)
					.toFixed(2);

				const areaAplicadaOperacao = data.plantations.map(
					(data) => data.applied_area
				);
				const areaTotalAplicadaOperacao = areaAplicadaOperacao
					.reduce((a, b) => a + b, 0)
					.toFixed(2);

				totalSaldoAplicacao =
					parseFloat(areaTotalSolicitadaOperacao) - parseFloat(areaTotalAplicadaOperacao);
			//AREA LIQUIDO
			} else if (data.inputs.length === 2) {
				const areaSolicitadaSolido = data.plantations.map(
					(data) => data.sought_area
				);
				const areaTotalSolicitadaSolido = areaSolicitadaSolido
					.reduce((a, b) => a + b, 0)
					.toFixed(2);

				const areaAplicadaSolido = data.plantations.map(
					(data) => data.applied_area
				);
				const areaTotalAplicadaSolido = areaAplicadaSolido
					.reduce((a, b) => a + b, 0)
					.toFixed(2);

				totalSaldoSolidos =
					parseFloat(areaTotalSolicitadaSolido) - parseFloat(areaTotalAplicadaSolido);
			//AREA SOLIDO
			} else if (data.inputs.length > 2) {
				const areaSolicitadaLiquido = data.plantations.map(
					(data) => data.sought_area
				);
				const areaTotalSolicitadaLiquido = areaSolicitadaLiquido
					.reduce((a, b) => a + b, 0)
					.toFixed(2);

				const areaAplicadaLiquido = data.plantations.map(
					(data) => data.applied_area
				);
				const areaTotalAplicadaLiquido = areaAplicadaLiquido
					.reduce((a, b) => a + b, 0)
					.toFixed(2);

				totalSaldosLiquidos =
					parseFloat(areaTotalSolicitadaLiquido) - parseFloat(areaTotalAplicadaLiquido);
			}

			return {
				fazenda: farm,
				cultura: cultura || planned_cult,
				area: areaTotalSolicitada,
				aplicado: areaTotalAplicada,
				saldo: saldoAplicar.toFixed(2),
				saldoSolido: totalSaldoSolidos,
				saldoLiquido: totalSaldosLiquidos,
				saldoOperacao: totalSaldoAplicacao
			};
		});

	const geralApp = newArr.reduce(
		(result, value) => {
			const { area, aplicado, saldo, saldoSolido, saldoLiquido, saldoOperacao } = value;

			result.area += Number(area);
			result.aplicado += Number(aplicado);
			result.saldo += Number(saldo);
			result.saldoSolido += Number(saldoSolido);
			result.saldoLiquido += Number(saldoLiquido);
			result.saldoOperacao += Number(saldoOperacao);
			return result;
		},
		{
			area: 0,
			aplicado: 0,
			saldo: 0,
			saldoSolido: 0,
			saldoLiquido: 0,
			saldoOperacao: 0
		}
	);

	const fazendasApp = newArr.reduce((result, value) => {
		const { area, aplicado, saldo, fazenda, cultura, saldoSolido, saldoLiquido, saldoOperacao } = value;
		const formCult = cultura ? cultura : "SemCultura";
		if (!result[fazenda]) {
			result[fazenda] = {
				area: Number(area),
				aplicado: Number(aplicado),
				saldo: Number(saldo),
				saldoSolido: Number(saldoSolido),
				saldoLiquido: Number(saldoLiquido),
				saldoOperacao: Number(saldoOperacao)
			};
		} else {
			result[fazenda].area += Number(area);
			result[fazenda].aplicado += Number(aplicado);
			result[fazenda].saldo += Number(saldo);
			result[fazenda].saldoSolido += Number(saldoSolido);
			result[fazenda].saldoLiquido += Number(saldoLiquido);
			result[fazenda].saldoOperacao += Number(saldoOperacao);
		}

		if (!result[fazenda][formCult]) {
			result[fazenda][formCult] = Number(saldo);
		} else {
			result[fazenda][formCult] += Number(saldo);
		}
		return result;
	}, {});

	return {
		geral: geralApp,
		fazendas: fazendasApp
	};
};
