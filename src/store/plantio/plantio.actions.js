import { PLANTIO_ACTIONS_TYPES } from "./plantio.types";

import { createAction } from "../../utils/reducer/reducer";

export const setPlantio = (plantio) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_PLANTIO, plantio);
};

export const setApp = (app) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_APP, app);
};

export const setSafraCilco = (safraCiclo) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_SAFRA_CICLO, safraCiclo);
};
