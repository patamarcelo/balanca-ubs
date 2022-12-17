import { USER_ACTIONS_TYPES } from "./user.types";

import { createAction } from "../../utils/reducer/reducer";

export const setIsAdminUser = (user) => {
	let boolean = false;
	const isAdmin = user.user.reloadUserInfo.customAttributes;
	if (isAdmin) {
		const isAdminBool = JSON.parse(isAdmin);
		if (isAdminBool.admin) {
			boolean = true;
		} else {
			boolean = false;
		}
	}
	console.log(
		process.env.NODE_ENV !== "production" ? `Admin User? ${boolean}` : ""
	);
	return createAction(USER_ACTIONS_TYPES.SET_ADMIN_USER, boolean);
};
export const setIsAdminUserReducer = (user) => {
	let boolean = false;
	if (user?.reloadUserInfo) {
		const isAdmin = user.reloadUserInfo.customAttributes;
		if (isAdmin) {
			const isAdminBool = JSON.parse(isAdmin);
			if (isAdminBool.admin) {
				boolean = true;
			} else {
				boolean = false;
			}
		}
	}
	return boolean;
};

export const setUser = (user) => {
	return createAction(USER_ACTIONS_TYPES.SET_CURRENT_USER, user);
};

export const setIsAuthUser = (boolean) => {
	return createAction(USER_ACTIONS_TYPES.SET_AUTH_USER, boolean);
};

export const logOffUser = () => {
	return createAction(USER_ACTIONS_TYPES.LOG_OFF_USER);
};
