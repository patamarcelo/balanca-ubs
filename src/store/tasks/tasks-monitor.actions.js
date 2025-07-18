import djangoApi from "../../utils/axios/axios.utils";
import Swal from "sweetalert2";

let interval = null;

export const startTaskMonitor = (taskId, onSuccessCallback) => {
    return (dispatch) => {
        dispatch({ type: "TASK_MONITOR/START", payload: { taskId } });

        interval = setInterval(async () => {
            try {
                const res = await djangoApi.get(`/backgroundtask/${taskId}/task_status/`, {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                    },
                });

                const { status, result, name, started_at, ended_at } = res.data;

                if (status === "done") {
                    clearInterval(interval);
                    dispatch({
                        type: "TASK_MONITOR/UPDATE",
                        payload: { status, result, name, started_at, ended_at },
                    });

                    // ✅ Aguarda o callback ser finalizado (caso seja async)
                    if (typeof onSuccessCallback === "function") {
                        await onSuccessCallback(); // <- importante!
                    }

                    // ✅ Só exibe o Swal depois de tudo pronto
                    Swal.fire({
                        title: "Sucesso!",
                        html: `<b>Banco atualizado com sucesso!</b>`,
                        icon: "success",
                    });
                }

                if (status === "failed") {
                    clearInterval(interval);
                    dispatch({
                        type: "TASK_MONITOR/UPDATE",
                        payload: { status: "failed", result: null },
                    });
                    Swal.fire({
                        title: "Erro!",
                        html: `<b>Falha ao atualizar o banco!</b>`,
                        icon: "error",
                    });
                }
            } catch (err) {
                console.error("Erro ao monitorar task:", err);
                clearInterval(interval);
                dispatch({
                    type: "TASK_MONITOR/UPDATE",
                    payload: { status: "failed", result: null },
                });
                Swal.fire({
                    title: "Erro!",
                    html: `<b>Erro ao monitorar o status da tarefa</b><br>${err.message}`,
                    icon: "error",
                });
            }
        }, 2000);
    };
};

export const resetTaskMonitor = () => {
    if (interval) clearInterval(interval);
    return { type: "TASK_MONITOR/RESET" };
};