import { PLANTIO_ACTIONS_TYPES } from "./plantio.types";

const INITIAL_STATE = {
	plantio: [],
	app: []
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
		default:
			return state;
	}
};
