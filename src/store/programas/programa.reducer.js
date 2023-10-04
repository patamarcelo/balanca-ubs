import { PROGRAMA_ACTIONS_TYPES } from "./programa.types";

const INITIAL_STATE = {
	operacoes: [],
	estagios: [],
	programas: [],
	areas: []
};

export const programaReducer = (state = INITIAL_STATE, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case PROGRAMA_ACTIONS_TYPES.SET_OPERACOES:
			return {
				...state,
				operacoes: payload
			};
		case PROGRAMA_ACTIONS_TYPES.SET_ESTAGIOS:
			return {
				...state,
				estagios: payload
			};
		case PROGRAMA_ACTIONS_TYPES.SET_PROGRAMAS:
			return {
				...state,
				programas: payload
			};
		case PROGRAMA_ACTIONS_TYPES.SET_AREAS:
			return {
				...state,
				areas: payload
			};
		default:
			return state;
	}
};
