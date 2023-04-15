export const TRUCK_INITIAL_STATE = {
	data: "",
	pesoBruto: "",
	tara: "",
	liquido: "",
	placa: "",
	cultura: "",
	umidade: "",
	mercadoria: "",
	origem: "",
	fazendaOrigem: "",
	impureza: "",
	projeto: "",
	motorista: "",
	saida: "",
	observacoes: "",
	destino: "",
	fazendaDestino: "",
	parcela: "",
	nfEntrada: "",
	op: "",
	relatorioColheita: "",
	ticket: ""
};

// TRUCK INPUT AND FORM
export const TRUCK = [
	{
		label: "Placa",
		name: "placa",
		placeholder: "Placa",
		type: "text"
	},
	{
		label: "Motorista",
		name: "motorista",
		placeholder: "Motorista",
		type: "text"
	},
	{
		label: "Tara Veículo",
		name: "tara",
		placeholder: "Tara Veículo",
		type: "tel"
	},
	{
		label: "Peso Bruto",
		name: "pesoBruto",
		placeholder: "Peso Bruto",
		type: "tel"
	},
	{
		label: "Peso Liquido",
		name: "liquido",
		placeholder: "Peso Liquido",
		type: "text",
		disabled: true
	}
];
export const TRUCK_OBS = [
	{
		label: "Origem - Outros",
		name: "origem",
		placeholder: "Origem - Outros",
		// required: true,
		type: "text"
	},
	{
		label: "Destino - Outros",
		name: "destino",
		placeholder: "Destino - Outros",
		// required: true,
		type: "text"
	},
	{
		label: "Parcela",
		name: "parcela",
		placeholder: "Parcela",
		type: "text",
		helperText: 'Coloque as parcelas separadas por vírgula: A01,A02',
	},
	{
		label: "Cultura",
		name: "cultura",
		placeholder: "Cultura",
		type: "text"
	},
	{
		label: "Mercadoria",
		name: "mercadoria",
		placeholder: "mercadoria",
		// required: true,
		type: "text"
	},
	{
		label: "Projeto",
		name: "projeto",
		placeholder: "Projeto",
		type: "text"
	}
];

export const TRUCK_SHEETS = [
	{
		label: "NF Entrada",
		name: "nfEntrada",
		placeholder: "NF Entrada",
		type: "text"
	},
	{
		label: "Relatorio Colheita",
		name: "relatorioColheita",
		placeholder: "Relatorio Colheita",
		type: "text"
	},
	{
		label: "OP",
		name: "op",
		placeholder: "OP",
		type: "text"
	},
	{
		label: "Ticket",
		name: "ticket",
		placeholder: "Ticket",
		type: "tel"
	},
	{
		label: "Umidade",
		name: "umidade",
		placeholder: "Umidade",
		// required: true,
		type: "number"
	},
	{
		label: "Impureza",
		name: "impureza",
		placeholder: "Impureza",
		// required: true,
		type: "number"
	}
];
export const FAZENDA_ORIGEM = [
	{ id: 35, local: "Projeto 5 Estrelas", user: "5Estrelas" },
	{ id: 31, local: "Projeto Benção de Deus", user: "bencaoDeDeus" },
	// { id: 42, local: "Projeto Biguá" , user: "bigua"},
	{ id: 43, local: "Projeto Cacíque", user: "campoGuapo" },
	{ id: 32, local: "Projeto Campo Guapo", user: "campoGuapo" },
	{ id: 5, local: "Projeto Capivara", user: "diamante" },
	{ id: 7, local: "Projeto Cervo", user: "diamante" },
	{ id: 12, local: "Projeto Eldorado", user: "eldorado" },
	{ id: 36, local: "Projeto Fazendinha", user: "fazendinha" },
	{ id: 4, local: "Projeto Jacaré", user: "diamante" },
	// { id: 44, local: "Projeto João de Barro" , user: ""},
	{ id: 8, local: "Projeto Lago Verde", user: "lagoVerde" },
	{ id: 40, local: "Projeto Novo Acordo", user: "novoAcordo" },
	{ id: 1, local: "Projeto Ouro Verde", user: "ouroVerde" },
	// { id: 16, local: "Projeto Pau Brasil" , user: ""},
	{ id: 10, local: "Projeto Praia Alta", user: "diamante" },
	{ id: 2, local: "Projeto Safira", user: "campoGuapo" },
	{ id: 11, local: "Projeto Santa Maria", user: "santaMaria" },
	// { id: 19, local: "Projeto São Pedro" , user: ""},
	{ id: 3, local: "Projeto Tucano", user: "diamante" },
	{ id: 6, local: "Projeto Tuiuiu", user: "diamante" },
	{ id: 46, local: "Diamante", user: "diamante" },
	{ id: 45, local: "UBS", user: "ubs" },
	{ id: "D3", local: "Fazenda Biguá", user: "outros" },
	{ id: "D4", local: "Fazendão", user: "outros" },
	{ id: "D9", local: "Uniraça", user: "outros" },
	{ id: "D10", local: "Bom De Gosto", user: "outros" },
	// { id: "D5", local: "Agronorte", user: "outros" },
	// { id: "D6", local: "Cajueiro", user: "outros" },
	// { id: "D7", local: "JK", user: "outros" },
	// { id: "D8", local: "FTS", user: "outros" },
	{ id: 47, local: "Outros", user: "outros" }
];
