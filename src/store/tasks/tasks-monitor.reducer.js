const INITIAL_STATE = {
    status: "idle", // idle | running | done | failed
    taskId: null,
    result: null,
};

export const taskMonitorReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "TASK_MONITOR/START":
            return {
                ...state,
                status: "running",
                taskId: action.payload.taskId,
            };
        case "TASK_MONITOR/UPDATE":
            return {
                ...state,
                status: action.payload.status,
                result: action.payload.result,
            };
        case "TASK_MONITOR/RESET":
            return INITIAL_STATE;
        default:
            return state;
    }
};