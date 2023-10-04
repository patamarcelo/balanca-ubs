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
