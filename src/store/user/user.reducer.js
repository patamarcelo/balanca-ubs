import { USER_ACTIONS_TYPES } from "./user.types";
import { setIsAdminUserReducer, setIsBalancaUserReducer } from "./user.action";

export const INITIAL_STATE = {
	currentUser: null,
	isAuth: false,
	isAdmin: false,
	isBalanca: false,
	asaasToken: "$" + process.env.REACT_APP_ASAAS_TOKEN + "=="
};

export const userReducer = (state = INITIAL_STATE, action = {}) => {
	// process.env.NODE_ENV !== "production" && console.log("dispatch");
	// process.env.NODE_ENV !== "production" && console.log(action);
	const { type, payload } = action;
	switch (type) {
		case USER_ACTIONS_TYPES.SET_CURRENT_USER:
			const isAdminUser = setIsAdminUserReducer(payload);
			const isBalanca = setIsBalancaUserReducer(payload);
			return {
				...state,
				currentUser: payload,
				isAdmin: isAdminUser,
				isBalanca: isBalanca
			};
		case USER_ACTIONS_TYPES.SET_AUTH_USER:
			return {
				...state,
				isAuth: payload
			};
		case USER_ACTIONS_TYPES.SET_ADMIN_USER:
			return {
				...state,
				isAdmin: payload
			};
		case USER_ACTIONS_TYPES.LOG_OFF_USER:
			return {
				state: INITIAL_STATE
			};
		default:
			return state;
	}
};
