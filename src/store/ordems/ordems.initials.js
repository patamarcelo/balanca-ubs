// INITIAL VALUES
export const initialOrdemValues = {
	origem: "",
	destino: "",
	placaTrator: "",
	placaVagao1: "",
	placaVagao2: "",
	motorista: "",
	cpf: "",
	empresa: "",
	cpfcnpj: "",
	veiculo: "",
	mercadoria: "",
	observacao: ""
};

export const ordemFields = [
	{
		label: "Origem",
		name: "origem",
		placeholder: "Origem",
		type: "text",
        col: '3'

	},
	{
		label: "Destino",
		name: "destino",
		placeholder: "Destino",
		type: "text",
        col: '3'
	},
    {
		label: "Motorista",
		name: "motorista",
		placeholder: "Motorista",
		type: "text",
        col: '3'
	},
	{
		label: "CPF",
		name: "cpf",
		placeholder: "cpf",
		type: "tel",
        col: '3'
	},
	{
		label: "Placa Cavalo",
		name: "placaTrator",
		placeholder: "Placa Trator",
		type: "text",
        col: '2'
	},
	{
		label: "Placa Carreta",
		name: "placaVagao1",
		placeholder: "Placa Carreta",
		type: "text",
        col: '2'
	},
	{
		label: "Placa Carreta ",
		name: "placaVagao2",
		placeholder: "Placa Carreta",
		type: "text",
        col: '2'
	},
	{
		label: "Empresa",
		name: "empresa",
		placeholder: "empresa",
		type: "text",
        col: '3'
	},
	{
		label: "CPF / CNPJ",
		name: "cpfcnpj",
		placeholder: "CPF / CNPJ",
		type: "tel",
        col: '3'
	},
	{
		label: "Veículo",
		name: "veiculo",
		placeholder: "Veículo",
		type: "text",
        col: '3'
	},
	{
		label: "Mercadoria",
		name: "mercadoria",
		placeholder: "Mercadoria",
		type: "text",
        col: '3'
	},
	{
		label: "Observações",
		name: "observacao",
		placeholder: "Observações",
		type: "text",
        col: '6',
        rows: 4
	}
];
