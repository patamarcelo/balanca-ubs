export const createDinamicTable = (data) => {
	const tableArray = [];
	let count = 0;
	data.forEach((data, i) => {
		const cronograma = data.dados.cronograma;
		const projeto = data.fazenda;
		const parcela = data.parcela;
		const dados = data.dados;
		const safra = dados.safra;
		const ciclo = dados.ciclo;
		const cultura = dados.cultura;
		const variedade = dados.variedade;
		const fazendaGrupo = dados.fazenda_grupo;
		const talhaoIdUnico = dados.talhao_id_unico;
		const plantioFinalizado = dados.plantio_finalizado;
		const area = dados.area_colheita.toFixed(2).replace(".", ",");
		const dataPlantio = dados.data_plantio;
		const dap = dados.dap;
		const programa = dados.programa;
		const programaStartDate = dados.programa_start_date;
		const programaEndDate = dados.programa_end_date;
		const capacidadePlantioDia = dados.capacidade_plantio_dia;
		cronograma.forEach((data, i) => {
			const estagio = data.estagio;
			const dapAplicacao = data.dap;
			const dataPrevista = data["data prevista"];
			const produtos = data.produtos;
			produtos.forEach((prod, i) => {
				const produto = prod.produto;
				const tipo = prod.tipo;
				const dose = prod.dose.toFixed(3).replace(".", ",");
				const quantidadeAplicar = prod["quantidade aplicar"]
					.toFixed(4)
					.replace(".", ",");
				const newObj = {
					id: count,
					projeto: projeto,
					parcela: parcela,
					safra: safra,
					ciclo: ciclo,
					cultura: cultura,
					variedade: variedade,
					fazendaGrupo: fazendaGrupo,
					talhaoIdUnico: talhaoIdUnico,
					plantioFinalizado: plantioFinalizado,
					area: area,
					dataPlantio: dataPlantio,
					dap: dap,
					programa: programa,
					programaStartDate: programaStartDate,
					programaEndDate: programaEndDate,
					capacidadePlantioDia: capacidadePlantioDia,
					estagio: estagio,
					dapAplicacao: dapAplicacao,
					dataPrevista: dataPrevista,
					produto: produto,
					tipo: tipo,
					dose: dose,
					quantidadeAplicar: quantidadeAplicar
				};
				tableArray.push(newObj);
				count += 1;
			});
		});
	});
	return tableArray;
};

export const createDataTable = (data) => {
	const tableArray = [];
	let count = 0;
	data.forEach((data, i) => {
		const cronograma = data.dados.cronograma;
		const projeto = data.fazenda;
		const parcela = data.parcela;
		const dados = data.dados;
		const safra = dados.safra;
		const ciclo = dados.ciclo;
		const cultura = dados.cultura;
		const variedade = dados.variedade;
		const fazendaGrupo = dados.fazenda_grupo;
		const talhaoIdUnico = dados.talhao_id_unico;
		const plantioFinalizado = dados.plantio_finalizado;
		const area = dados.area_colheita.toFixed(2).replace(".", ",");
		const dataPlantio = dados.data_plantio;
		const dap = dados.dap;
		const programa = dados.programa;
		const programaStartDate = dados.programa_start_date;
		const programaEndDate = dados.programa_end_date;
		const capacidadePlantioDia = dados.capacidade_plantio_dia;
		cronograma.forEach((data, i) => {
			const estagio = data.estagio;
			const dapAplicacao = data.dap;
			const dataPrevista = data["data prevista"];
			if (plantioFinalizado && dapAplicacao > 0) {
				const newObj = {
					id: count,
					projeto: projeto,
					parcela: parcela,
					safra: safra,
					ciclo: ciclo,
					cultura: cultura,
					variedade: variedade,
					fazendaGrupo: fazendaGrupo,
					talhaoIdUnico: talhaoIdUnico,
					plantioFinalizado: plantioFinalizado,
					area: area,
					dataPlantio: dataPlantio,
					dap: dap,
					programa: programa,
					programaStartDate: programaStartDate,
					programaEndDate: programaEndDate,
					capacidadePlantioDia: capacidadePlantioDia,
					estagio: estagio,
					dapAplicacao: dapAplicacao,
					dataPrevista: dataPrevista
				};
				tableArray.push(newObj);
				count += 1;
			}
		});
	});
	return tableArray;
};