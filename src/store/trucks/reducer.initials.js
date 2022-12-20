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
	observacoes: ''
};

// TRUCK INPUT AND FORM
export const TRUCK = [
	{
		label: "Peso Bruto",
		name: "pesoBruto",
		placeholder: "Peso Bruto",
		// required: true,
		type: "number"
	},
	{
		label: "Cultura",
		name: "cultura",
		placeholder: "Cultura",
		// required: true,
		type: "text"
	},
	{
		label: "Tara Veículo",
		name: "tara",
		placeholder: "Tara Veículo",
		// required: true,
		type: "number"
	},
	{
		label: "Placa",
		name: "placa",
		placeholder: "Placa",
		// required: true,
		type: "text"
	},
	{
		label: "Peso Liquido",
		name: "liquido",
		placeholder: "Peso Liquido",
		// required: true,
		type: "text",
		disabled: true
	}
];
export const TRUCK_OBS = [
	{
		label: "Umidade",
		name: "umidade",
		placeholder: "Umidade",
		// required: true,
		type: "number"
	},
	{
		label: "Mercadoria",
		name: "mercadoria",
		placeholder: "mercadoria",
		// required: true,
		type: "text"
	},
	{
		label: "Origem",
		name: "origem",
		placeholder: "Origem",
		// required: true,
		type: "text"
	},
	{
		label: "Impureza",
		name: "impureza",
		placeholder: "Impureza",
		// required: true,
		type: "number"
	},
	{
		label: "Projeto",
		name: "projeto",
		placeholder: "Projeto",
		// required: true,
		type: "text"
	},
	{
		label: "Motorista",
		name: "motorista",
		placeholder: "Motorista",
		// required: true,
		type: "text"
	}
];
