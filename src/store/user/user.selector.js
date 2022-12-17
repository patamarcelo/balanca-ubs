export const selectCurrentUser = (state) => state.user.currentUser;

export const selectIsAuthUser = (state) => state.user.isAuth;

export const selectIsAdminUser = (state) => state.user.isAdmin;

export const selectAsaasToken = (state) => state.user.asaasToken;
