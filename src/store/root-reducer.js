import { combineReducers } from "redux";

import { userReducer } from "./user/user.reducer";
import { TruckReport } from "./trucks/reducer.trucks";
import { plantioReducer } from "./plantio/plantio.reducer";
import { programaReducer } from "./programas/programa.reducer";

export const rootReducer = combineReducers({
	user: userReducer,
	truckLoads: TruckReport,
	plantio: plantioReducer,
	programa: programaReducer
});
