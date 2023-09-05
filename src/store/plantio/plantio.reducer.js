import { PLANTIO_ACTIONS_TYPES } from "./plantio.types";

const INITIAL_STATE = {
	plantio: [],
	plantioMapAll: [],
	app: [],
	appFarmBox: [],
	safraCiclo: { safra: "", ciclo: "" }
};

export const plantioReducer = (state = INITIAL_STATE, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case PLANTIO_ACTIONS_TYPES.SET_PLANTIO:
			return {
				...state,
				plantio: payload
			};
		case PLANTIO_ACTIONS_TYPES.SET_APP:
			return {
				...state,
				app: payload
			};
		case PLANTIO_ACTIONS_TYPES.SET_APP_FARMBOX:
			return {
				...state,
				appFarmBox: payload
			};
		case PLANTIO_ACTIONS_TYPES.SET_SAFRA_CICLO:
			return {
				...state,
				safraCiclo: payload
			};
		case PLANTIO_ACTIONS_TYPES.SET_PLANTIO_MAP_ALL:
			return {
				...state,
				plantioMapAll: payload
			};
		default:
			return state;
	}
};
