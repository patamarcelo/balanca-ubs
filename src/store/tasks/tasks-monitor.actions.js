import djangoApi from "../../utils/axios/axios.utils";
import Swal from "sweetalert2";

let interval = null;

export const startTaskMonitor = (taskId, onSuccessCallback) => {
    return (dispatch) => {
        dispatch({ type: "TASK_MONITOR/START", payload: { taskId } });

        let tries404 = 0;
        let triesAny = 0;

        interval = setInterval(async () => {
            triesAny++;

            try {
                const res = await djangoApi.get(`/backgroundtask/${taskId}/task_status/`, {
                    headers: { Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}` },
                });

                tries404 = 0; // zerou pq achou
                const { status, result, name, started_at, ended_at } = res.data;

                if (status === "done") {
                    clearInterval(interval);
                    dispatch({ type: "TASK_MONITOR/UPDATE", payload: { status, result, name, started_at, ended_at } });
                    if (typeof onSuccessCallback === "function") await onSuccessCallback();
                    Swal.fire({ title: "Sucesso!", html: `<b>Banco atualizado com sucesso!</b>`, icon: "success" });
                    return;
                }

                if (status === "failed" || status === "error") {
                    clearInterval(interval);
                    dispatch({ type: "TASK_MONITOR/UPDATE", payload: { status: "failed", result: null } });
                    Swal.fire({ title: "Erro!", html: `<b>Falha ao atualizar o banco!</b>`, icon: "error" });
                    return;
                }

                // opcional: atualizar “pending/running” no store
                dispatch({ type: "TASK_MONITOR/UPDATE", payload: { status, result, name, started_at, ended_at } });

            } catch (err) {
                const http = err?.response?.status;

                // ✅ se for 404, espera alguns ciclos (race/commit/roteamento)
                if (http === 404 && tries404 < 10) {
                    tries404++;
                    return; // não mata o interval
                }

                // ✅ se já passou “tempo demais”, aí sim falha
                if (triesAny < 30) { // ~60s tolerância geral
                    return;
                }

                console.error("Erro ao monitorar task:", err);
                clearInterval(interval);
                dispatch({ type: "TASK_MONITOR/UPDATE", payload: { status: "failed", result: null } });
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