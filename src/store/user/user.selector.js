export const selectCurrentUser = (state) => state.user.currentUser;

export const selectIsAuthUser = (state) => state.user.isAuth;

export const selectIsAdminUser = (state) => state.user.isAdmin;

export const selectIBalancaUser = (state) => state.user.isBalanca;

export const selectIsVendasUser = (state) => state.user.isVendas;

export const selectIsDefensivosUser = (state) => state.user.isDefensivos;

export const selectUnidadeOpUser = (state) => {
	const userUnidadeOp = state.user.unidadeOp ? state.user.unidadeOp : "ubs";
	return userUnidadeOp;
};

export const selectAsaasToken = (state) => state.user.asaasToken;

export const selectDjangoToken = (state) => state.user.token;
