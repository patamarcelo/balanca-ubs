import {
    Alert,
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Switch,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";

import ReportTable from "../../components/report-itens/report-table";
import { selectTruckLoadsFormatData } from "../../store/trucks/trucks.selector";
import { setTruckLoads } from "../../store/trucks/trucks.actions";
import {
    selectUnidadeOpUser,
    selectIsAdminUser,
} from "../../store/user/user.selector";
import { FAZENDA_ORIGEM } from "../../store/trucks/reducer.initials";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

const ReportPage = () => {
    const dataTableForm = useSelector(selectTruckLoadsFormatData);
    const unidadeOpUser = useSelector(selectUnidadeOpUser);
    const isAdminUser = useSelector(selectIsAdminUser);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [saved, handlerSave] = useState(0);
    const [totalLoadDataStatus, setTotalLoadDataStatus] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [appliedRange, setAppliedRange] = useState(null);
    const [rangeError, setRangeError] = useState("");
    const [queryError, setQueryError] = useState("");

    const filteredTable = useMemo(() => {
        if (unidadeOpUser === "ubs") return dataTableForm;

        const origemDest = FAZENDA_ORIGEM
            .filter((data) => data.user === unidadeOpUser)
            .map((data) => data.local);

        return dataTableForm.filter(
            (data) =>
                data.unidadeOp === unidadeOpUser ||
                origemDest.includes(data.fazendaDestino) ||
                origemDest.includes(data.fazendaOrigem)
        );
    }, [dataTableForm, unidadeOpUser]);

    const handleGetDataFromServer = (event) => {
        if (!isAdminUser) return;

        setTotalLoadDataStatus(event.target.checked);
        setAppliedRange(null);
        setRangeError("");
    };

    const handleDateSearch = (event) => {
        event.preventDefault();
        if (!isAdminUser) return;

        if (!startDate || !endDate) {
            setRangeError("Informe a data inicial e a data final.");
            return;
        }

        if (startDate > endDate) {
            setRangeError(
                "A data inicial não pode ser posterior à data final."
            );
            return;
        }

        setRangeError("");
        setAppliedRange({ start: startDate, end: endDate });
    };

    useEffect(() => {
        let active = true;
        let unsubscribe;

        setIsLoading(true);
        setQueryError("");

        const handleError = (error) => {
            if (!active) return;

            console.error("Erro ao consultar cargas:", error);
            setQueryError(
                "Não foi possível consultar as cargas. " +
                "Os resultados anteriores foram mantidos. Tente novamente."
            );
            setIsLoading(false);
        };

        try {
            const collRef = collection(db, TABLES_FIREBASE.truckmove);
            const constraints = [orderBy("createdAt", "desc")];

            if (isAdminUser && appliedRange) {
                // Datas no horário de Brasília, incluindo o dia final inteiro.
                const start = new Date(
                    `${appliedRange.start}T00:00:00-03:00`
                );
                const endExclusive = new Date(
                    `${appliedRange.end}T00:00:00-03:00`
                );
                endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

                constraints.push(
                    where("createdAt", ">=", Timestamp.fromDate(start)),
                    where("createdAt", "<", Timestamp.fromDate(endExclusive))
                );
            } else {
                constraints.push(
                    limit(isAdminUser && totalLoadDataStatus ? 3000 : 700)
                );
            }

            unsubscribe = onSnapshot(
                query(collRef, ...constraints),
                (snapshot) => {
                    if (!active) return;

                    dispatch(
                        setTruckLoads(
                            snapshot.docs.map((doc) => {
                                const data = doc.data();

                                return {
                                    ...data,
                                    id: doc.id,
                                    unidadeOp: data.unidadeOp || "ubs",
                                };
                            })
                        )
                    );

                    setIsLoading(false);
                },
                handleError
            );
        } catch (error) {
            handleError(error);
        }

        return () => {
            active = false;
            if (unsubscribe) unsubscribe();
        };
    }, [isAdminUser, appliedRange, totalLoadDataStatus, dispatch]);

    return (
        <Box minWidth="100%" height="98%">
            {isAdminUser && (
                <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center">
                        <Switch
                            checked={totalLoadDataStatus}
                            onChange={handleGetDataFromServer}
                            inputProps={{
                                "aria-label": "Consultar últimas 3.000 cargas",
                            }}
                            color="warning"
                        />
                        <Typography variant="h6">
                            {totalLoadDataStatus
                                ? "3.000 resultados recentes"
                                : "700 resultados recentes"}
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleDateSearch}
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Data inicial"
                            type="date"
                            size="small"
                            value={startDate}
                            onChange={(event) =>
                                setStartDate(event.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Data final"
                            type="date"
                            size="small"
                            value={endDate}
                            onChange={(event) =>
                                setEndDate(event.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            startIcon={
                                isLoading ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : null
                            }
                        >
                            Consultar
                        </Button>

                        {appliedRange && (
                            <Button
                                disabled={isLoading}
                                onClick={() => {
                                    setAppliedRange(null);
                                    setRangeError("");
                                }}
                            >
                                Voltar às cargas recentes
                            </Button>
                        )}
                    </Box>

                    {appliedRange && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Consulta por data de cadastro, no horário de
                            Brasília, incluindo o dia final e sem limite
                            de 3.000 cargas.
                        </Typography>
                    )}

                    {rangeError && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                            {rangeError}
                        </Alert>
                    )}
                </Box>
            )}

            {queryError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {queryError}
                </Alert>
            )}

            <ReportTable
                handlerSave={handlerSave}
                dataTable={filteredTable}
                isLoading={isLoading}
                saved={saved}
            />
        </Box>
    );
};

export default ReportPage;