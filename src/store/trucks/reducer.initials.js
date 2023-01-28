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
	impureza: "",
	projeto: "",
	motorista: "",
	saida: "",
	observacoes: "",
	destino: "",
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
		label: "Origem",
		name: "origem",
		placeholder: "Origem",
		// required: true,
		type: "text"
	},
	{
		label: "Destino",
		name: "destino",
		placeholder: "Destino",
		// required: true,
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

export const TRUCK_SHEETS = [
	{
		label: "NF Entrada",
		name: "nfEntrada",
		placeholder: "NF Entrada",
		type: "text"
	},
	{
		label: "Parcela",
		name: "parcela",
		placeholder: "Parcela",
		type: "text"
	},
	{
		label: "Cultura",
		name: "cultura",
		placeholder: "Cultura",
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
	}
];
