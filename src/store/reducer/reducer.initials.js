// CARD_USER INPUT AND FORM
export const CARD_INTIIAL_INPUT_VALUES = {
	holderName: "",
	number: "",
	expiryMonth: "",
	expiryYear: "",
	ccv: "",
};

export const CARD_INTIIAL_INPUT = [
	{
		label: "Número do Cartão",
		name: "number",
		placeholder: "Número do Cartão - Somente Dígitos",
		required: true,
		type: "tel"
	},
	{
		label: "Mês de Validade",
		name: "expiryMonth",
		placeholder: "MM",
		required: true,
		type: "tel"
	},
	{
		label: "Ano de Validade",
		name: "expiryYear",
		placeholder: "AAAA",
		required: true,
		type: "tel"
	},
	{
		label: "CVC",
		name: "cvc",
		placeholder: "Código Verificador",
		required: true,
		type: "tel"
	}
];

// USER INPUT AND FORM
export const USER_INTIIAL_INPUT_VALUES = {
	name: "",
	email: "",
	cpfCnpj: "",
	postalCode: "",
	addressNumber: "",
	phone: ""
};

export const USER_INTIIAL_INPUT = [
	{
		label: "Nome do titular do cartão",
		name: "name",
		placeholder: "Nome igual ao cartao",
		required: true,
		type: "text"
	},
	{
		label: "E-mail",
		name: "email",
		placeholder: "E-mail",
		required: true,
		type: "email",
		pattern: "",
		errorMessage: "Insira um e-mail válido"
	},
	{
		label: "Cpf do titular do cartão",
		name: "cpfCnpj",
		placeholder: "Cpf",
		required: true,
		type: "tel",
		maxLen: 11,
		pattern: "[0-9]*",
		inputMode: "numeric",
	},
	{
		label: "Cep",
		name: "postalCode",
		placeholder: "CEP",
		required: true,
		type: "tel",
		maxLen: 8,
		pattern: "[0-9]*",
		inputMode: "numeric",
	},
	{
		label: "Casa Número",
		name: "addressNumber",
		placeholder: "Casa Número",
		required: true,
		type: "tel",
		pattern: "[0-9]*",
		inputMode: "numeric",
	},
	{
		label: "Telefone",
		name: "phone",
		placeholder: "Telefone",
		required: true,
		type: "tel",
		pattern: "[0-9]*",
		inputMode: "numeric",
		maxLen: 11
	}
];
