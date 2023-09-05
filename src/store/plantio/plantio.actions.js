import { PLANTIO_ACTIONS_TYPES } from "./plantio.types";

import { createAction } from "../../utils/reducer/reducer";

export const setPlantio = (plantio) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_PLANTIO, plantio);
};

export const setApp = (app) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_APP, app);
};

export const setAppFarmBox = (appFarmBox) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_APP_FARMBOX, appFarmBox);
};

export const setSafraCilco = (safraCiclo) => {
	return createAction(PLANTIO_ACTIONS_TYPES.SET_SAFRA_CICLO, safraCiclo);
};

export const setPlantioMapAll = (plantioArray) => {
	return createAction(
		PLANTIO_ACTIONS_TYPES.SET_PLANTIO_MAP_ALL,
		plantioArray
	);
};
