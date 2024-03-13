import { TRUCKS_ACTIONS_TYPES } from "./trucks.types";
import { createAction } from "../../utils/reducer/reducer";

export const setTruckLoads = (truckLoads) => {
	return createAction(TRUCKS_ACTIONS_TYPES.SET_TRUCKS_LOADS, truckLoads);
};

export const setRomaneiosLoads = (romaneiosLoads) => {
	return createAction(TRUCKS_ACTIONS_TYPES.SET_ROMANEIOS_LOAD, romaneiosLoads);
};
