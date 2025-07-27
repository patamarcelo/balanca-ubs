// store/ui/ui.reducer.js

const INITIAL_STATE = {
    headerVisible: true
};

export const uiReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "UI/SHOW_HEADER":
            return {
                ...state,
                headerVisible: true
            };
        case "UI/HIDE_HEADER":
            return {
                ...state,
                headerVisible: false
            };
        case "UI/TOGGLE_HEADER":
            return {
                ...state,
                headerVisible: !state.headerVisible
            };
        default:
            return state;
    }
};