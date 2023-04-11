import { USER_ACTIONS_TYPES } from "./user.types";

import { createAction } from "../../utils/reducer/reducer";

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
export const setIsBalancaUserReducer = (user) => {
	let boolean = false;
	if (user?.reloadUserInfo) {
		const isAdmin = user.reloadUserInfo.customAttributes;
		if (isAdmin) {
			const isAdminBool = JSON.parse(isAdmin);
			if (isAdminBool.isBalanca) {
				boolean = true;
			} else {
				boolean = false;
			}
		}
	}
	return boolean;
};
export const setUnidadeOpUser = (user) => {
	let unidadeOp = "";
	if (user?.reloadUserInfo) {
		const customAttr = user.reloadUserInfo.customAttributes;
		if (customAttr) {
			const unidade = JSON.parse(customAttr);
			unidadeOp = unidade.unidadeOp;
		}
	}
	return unidadeOp;
};

export const setToken = (user) => {
	let token = "";
	if (user?.reloadUserInfo) {
		const customAttr = user.reloadUserInfo.customAttributes;
		if (customAttr) {
			const unidade = JSON.parse(customAttr);
			token = unidade.token;
		}
	}
	return token;
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
