// const today =
// 	new Date().getFullYear() +
// 	"-" +
// 	("0" + (new Date().getMonth() + 1)).slice(-2) +
// 	"-" +
// 	("0" + new Date().getDate()).slice(-2);

// const currentYear = new Date().getFullYear().toString().slice(0, 2);
import { TRUCKS_ACTIONS_TYPES } from "./trucks.types";

export const TRUCK_INITIAL_STATE = {
	truckLoads: [],
	carregando: 0,
	descarregando: 0
};

export const TruckReport = (state = TRUCK_INITIAL_STATE, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case TRUCKS_ACTIONS_TYPES.SET_TRUCKS_LOADS:
			return {
				...state,
				truckLoads: payload
			};
		default:
			return state;
	}
};
