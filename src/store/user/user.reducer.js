import { USER_ACTIONS_TYPES } from "./user.types";
import {
	setIsAdminUserReducer,
	setIsBalancaUserReducer,
	setUnidadeOpUser, 
	setToken
} from "./user.action";

export const INITIAL_STATE = {
	currentUser: null,
	isAuth: false,
	isAdmin: false,
	isBalanca: false,
	unidadeOp: ""
};

export const userReducer = (state = INITIAL_STATE, action = {}) => {
	// process.env.NODE_ENV !== "production" && console.log("dispatch");
	// process.env.NODE_ENV !== "production" && console.log(action);
	const { type, payload } = action;
	switch (type) {
		case USER_ACTIONS_TYPES.SET_CURRENT_USER:
			const isAdminUser = setIsAdminUserReducer(payload);
			const isBalanca = setIsBalancaUserReducer(payload);
			const unidadeOp = setUnidadeOpUser(payload);
			const token = setToken(payload);
			return {
				...state,
				currentUser: payload,
				isAdmin: isAdminUser,
				isBalanca: isBalanca,
				unidadeOp: unidadeOp,
				token: token
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
