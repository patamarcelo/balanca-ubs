import { combineReducers } from "redux";

import { userReducer } from "./user/user.reducer";
import { TruckReport } from "./trucks/reducer.trucks";

export const rootReducer = combineReducers({
	user: userReducer,
	truckLoads: TruckReport
});
