export const fazendaGrupoProjetos = [
	{ fazenda: "Outros", projetos: ["OUTROS"] },
	{
		fazenda: "Parcerias",
		projetos: [
			"Projeto 5 Estrelas",
			"Projeto João de Barro",
			"Projeto Ouro Verde",
			"Projeto Pau Brasil",
		],
	},
	{ fazenda: "Fazenda Benção de Deus", projetos: ["Projeto Benção de Deus"] },
	{ fazenda: "Fazenda Biguá", projetos: ["Projeto Biguá"] },
	{
		fazenda: "Fazenda Campo Guapo",
		projetos: ["Projeto Cacíque", "Projeto Campo Guapo", "Projeto Safira"],
	},
	{
		fazenda: "Fazenda Diamante",
		projetos: [
			"Projeto Capivara",
			"Projeto Cervo",
			"Projeto Diamante",
			"Projeto Jacaré",
			"Projeto Praia Alta",
			"Projeto Tucano",
			"Projeto Tuiuiu",
		],
	},
	{ fazenda: "Fazenda Eldorado", projetos: ["Projeto Eldorado"] },
	{ fazenda: "Fazenda Fazendinha", projetos: ["Projeto Fazendinha"] },
	{ fazenda: "Fazenda Lago Verde", projetos: ["Projeto Lago Verde"] },
	{ fazenda: "Fazenda Novo Acordo", projetos: ["Projeto Novo Acordo"] },
	{ fazenda: "Fazenda Santa Maria", projetos: ["Projeto Santa Maria"] },
	{ fazenda: "Fazenda São Pedro", projetos: ["Projeto São Pedro"] },
	{ fazenda: "UBS", projetos: ["UBS"] },
];

export const getAllProjects = () => {
	return fazendaGrupoProjetos
		.flatMap((grupo) => grupo.projetos)
		.filter(Boolean)
		.sort((a, b) => a.localeCompare(b, "pt-BR"));
};

export const sortProjects = (projects = []) => {
	return [...new Set(projects)]
		.filter(Boolean)
		.sort((a, b) => a.localeCompare(b, "pt-BR"));
};

export const getProjectsByFarm = () => {
	return fazendaGrupoProjetos.map((grupo) => ({
		...grupo,
		projetos: sortProjects(grupo.projetos),
	}));
};