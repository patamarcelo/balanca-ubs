const today =
	new Date().getFullYear() +
	"-" +
	("0" + (new Date().getMonth() + 1)).slice(-2) +
	"-" +
	("0" + new Date().getDate()).slice(-2);

const currentYear = new Date().getFullYear().toString().slice(0, 2);
export const INITIAL_STATE = {
	customer: "",
	billingType: "CREDIT_CARD",
	dueDate: today,
	payOptions: {},
	creditCard: {},
	creditCardHolderInfo: {},
	userCreated: {},
	realizedOperation: {}
};

export const crediCardReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS_TYPES.SET_USER_INFO:
			return {
				...state,
				creditCardHolderInfo: action.payload
			};
		case ACTIONS_TYPES.SET_PAY_OPTIONS:
			return {
				...state,
				payOptions: action.payload
			};
		case ACTIONS_TYPES.SET_CREDITCARD_INFO:
			return {
				...state,
				creditCard: {
					...action.payload,
					expiryYear: currentYear + action.payload.expiryYear
				}
			};
		case ACTIONS_TYPES.SET_CREATED_USER:
			return {
				...state,
				userCreated: action.payload
			};
		case ACTIONS_TYPES.SET_REALIZED_OPERATION:
			return {
				...state,
				realizedOperation: action.payload
			};
		default:
			console.error("error store");
	}
};

export const ACTIONS_TYPES = {
	SET_USER_INFO: "SET_USER_INFO",
	SET_CREDITCARD_INFO: "STE_CREDITCARD_INFO",
	SET_PAY_OPTIONS: "SET_PAY_OPTIONS",
	SET_CREATED_USER: "SET_CREATED_USER",
	SET_REALIZED_OPERATION: "SET_REALIZED_OPERATION"
};
