import { PROGRAMA_ACTIONS_TYPES } from "./programa.types";

import { createAction } from "../../utils/reducer/reducer";

export const setOperacoes = (operacoes) => {
	return createAction(PROGRAMA_ACTIONS_TYPES.SET_OPERACOES, operacoes);
};

export const setEstagios = (estagios) => {
	return createAction(PROGRAMA_ACTIONS_TYPES.SET_ESTAGIOS, estagios);
};

export const setProgramas = (programas) => {
	return createAction(PROGRAMA_ACTIONS_TYPES.SET_PROGRAMAS, programas);
};

export const setAreaTotal = (areas) => {
	return createAction(PROGRAMA_ACTIONS_TYPES.SET_AREAS, areas);
};

export const setFilteredOperationsAction = (payload) => {
	let newarr = payload.arr;
	if (payload.inputs.length > 0) {
		newarr = payload.arr.filter((data) => {
			return payload.inputs.includes(data.defensivo__tipo);
		});
	}
	return createAction(PROGRAMA_ACTIONS_TYPES.SET_OPERACOES, newarr);
};
