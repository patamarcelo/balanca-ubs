import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from 'react';

import { tokens } from "../../../theme";
import BarPlantioPlanner from "./bar-chart-plantio-comp.jsx";

import { dataPlannerHandler, consolidateData, groupExecutedByWeek, dataPlannerHandlerBarChart } from './data-handler.js';
import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";

import TableComonent from './planned-plantio-table';
import DashboardTable from "./sent-seeds.jsx";
import TotalCOmp from "./planted-info.jsx";

import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Switch from '@mui/material/Switch';

import Fab from '@mui/material/Fab';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import html2canvas from 'html2canvas';

const PlantioAtual = ({ params }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isDark = theme.palette.mode === 'dark';

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSeed, setIsLoadingSeed] = useState(false);

    const [dataFromApiOriginal, setDataFromApiOriginal] = useState([]);
    const [dataFromApi, setDataFromApi] = useState([]);
    const [dataToBarChartPlanned, setDataToBarChartPlanned] = useState([]);
    const [onlyFarmsArr, setOnlyFarmsArr] = useState([]);
    const [executedAreaArr, setExecutedAreaArr] = useState([]);

    const [dataToBarChart, setDataToBarChart] = useState([]);
    const [sentSeedsData, setsentSeedsData] = useState([]);

    const [totalsSet, setTotalsSet] = useState({ planejado: null, plantado: null });

    const [togllePlantioColheitaView, setTogllePlantioColheitaView] = useState(true);

    const [dataToReport, setDataToReport] = useState(null);

    // refs para as 3 áreas a serem "printadas"
    const plannerRef = useRef(null);
    const acompanhamentoRef = useRef(null);
    const realizadoRef = useRef(null);

    useEffect(() => {
        function getFormattedDate() {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = now.getFullYear();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} - ${hours}:${minutes}`;
        }
        const newDate = getFormattedDate();
        setDataToReport(newDate);
    }, []);

    useEffect(() => {
        if (dataFromApiOriginal.length > 0) {
            const newData = dataPlannerHandler(dataFromApiOriginal, togllePlantioColheitaView);
            setDataFromApi(newData);
        }
    }, [togllePlantioColheitaView, dataFromApiOriginal]);

    useEffect(() => {
        if (dataFromApi.length > 0) {
            function getTotalPlannedUntilCurrentWeek(data) {
                // Get the current date and the start and end of the current week (Sunday to Saturday)
                const today = new Date();
                const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

                let totalPlannedSum = 0;

                data.forEach(entry => {
                    const [, endRange] = entry.weekRange.split(' - ').map(dateStr => {
                        // Convert "dd/mm/yyyy" to Date objects
                        const [day, month, year] = dateStr.split('/').map(Number);
                        return new Date(year, month - 1, day); // month is 0-indexed in JavaScript
                    });

                    // Check if the weekRange is before or includes the current week
                    if (endRange <= endOfWeek) {
                        totalPlannedSum += entry.totalPlanned;
                    }
                });

                return totalPlannedSum;
            }
            console.log('datafromAPI::::', dataFromApi);
            const totalProj = dataFromApi.reduce((acc, curr) => acc += curr.totalPlanned, 0);

            const totalPlanned = getTotalPlannedUntilCurrentWeek(dataToBarChartPlanned);
            const totalPlanted = executedAreaArr.reduce((acc, curr) => acc += curr.area_plantada, 0);
            const newTotals = {
                planejado: totalPlanned,
                plantado: totalPlanted,
                projetado: totalProj
            };

            setTotalsSet(newTotals);
        }
    }, [executedAreaArr, dataToBarChartPlanned, dataFromApi]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                await djangoApi
                    .get("plantio/get_plantio_planner_data/", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        },
                        params
                    })
                    .then((res) => {

                        const newData = dataPlannerHandler(res.data.dados.qs_planned);
                        const newDataBar = dataPlannerHandlerBarChart(res.data.dados.qs_planned);
                        setDataToBarChartPlanned(newDataBar);
                        setDataFromApiOriginal(res.data.dados.qs_planned);
                        setOnlyFarmsArr(res.data.dados.qs_planned_projetos.sort((b, a) => b.replace('Projeto').localeCompare(a.replace('Projeto'))));
                        setExecutedAreaArr(res.data.dados.qs_executed_area);
                        setDataFromApi(newData);
                    })
                    .catch((err) => console.log(err));
                setIsLoading(false);
            } catch (err) {
                console.log("Erro ao consumir a API", err);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setIsLoadingSeed(true);
                await djangoApi
                    .get("plantio/get_sent_seeds_data/", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        },
                        params
                    })
                    .then((res) => {
                        setsentSeedsData(res.data.dados.query_table);
                    })
                    .catch((err) => console.log(err));
                setIsLoadingSeed(false);
            } catch (err) {
                console.log("Erro ao consumir a API", err);
                setIsLoadingSeed(false);
            } finally {
                setIsLoadingSeed(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (executedAreaArr.length > 0 || dataToBarChartPlanned.length > 0) {
            const newArr = consolidateData(dataToBarChartPlanned, executedAreaArr);
            console.log('dataTobarChart: ', newArr);
            setDataToBarChart(newArr);
        }
    }, [dataToBarChartPlanned, executedAreaArr]);

    const handleRefresh = async () => {
        function getFormattedDate() {
            const now = new Date();

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = now.getFullYear();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} - ${hours}:${minutes}`;
        }
        const newDate = getFormattedDate();
        setDataToReport(newDate);
        try {
            setIsLoadingSeed(true);
            await djangoApi
                .get("plantio/get_sent_seeds_data/", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                    },
                    params
                })
                .then((res) => {
                    setsentSeedsData(res.data.dados.query_table);
                })
                .catch((err) => console.log(err));
            setIsLoadingSeed(false);
        } catch (err) {
            console.log("Erro ao consumir a API", err);
            setIsLoadingSeed(false);
        } finally {
            setIsLoadingSeed(false);
        }

        try {
            setIsLoading(true);
            await djangoApi
                .get("plantio/get_plantio_planner_data/", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                    },
                    params
                })
                .then((res) => {
                    const newData = dataPlannerHandler(res.data.dados.qs_planned);
                    const newDataBar = dataPlannerHandlerBarChart(res.data.dados.qs_planned);
                    setDataToBarChartPlanned(newDataBar);
                    setDataFromApiOriginal(res.data.dados.qs_planned);
                    setOnlyFarmsArr(res.data.dados.qs_planned_projetos.sort((b, a) => b.replace('Projeto').localeCompare(a.replace('Projeto'))));
                    setExecutedAreaArr(res.data.dados.qs_executed_area);
                    setDataFromApi(newData);
                })
                .catch((err) => console.log(err));
            setIsLoading(false);
        } catch (err) {
            console.log("Erro ao consumir a API", err);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    // helper para tirar print de uma div
    const captureElement = async (element, fileName) => {
        if (!element) return;
        const canvas = await html2canvas(element, {
            scale: 2,        // melhor qualidade
            useCORS: true,
            backgroundColor: theme.palette.background.default, // 👈 mantém o mesmo fundo do app

        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.click();
    };

    const handleTakeSnapshots = async () => {
        const safeDate = (dataToReport || '').replace(/[\/:\s-]/g, '_');

        await captureElement(plannerRef.current, `planner_${safeDate}.png`);
        await captureElement(acompanhamentoRef.current, `acompanhamento_${safeDate}.png`);
        await captureElement(realizadoRef.current, `realizado_${safeDate}.png`);
    };

    if (isLoading || isLoadingSeed) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress
                    sx={{ color: colors.blueAccent[100] }}
                />
            </Box>
        );
    }

    return (
        <Box
            width={"100%"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            display={"flex"}
            flexDirection={"column"}
            paddingLeft={6}
            paddingRight={6}
            paddingBottom={2}
            sx={{
                minWidth: "1365px",
            }}
        >
            {/* Botão de refresh fixo */}
            <Box
                sx={{
                    marginLeft: 'auto'
                }}
            >
                <IconButton
                    color="secondary"
                    aria-label="refresh"
                    sx={{ cursor: 'pointer', position: 'fixed', right: 20, top: 20 }}
                    onClick={handleRefresh}
                >
                    <AutorenewIcon />
                </IconButton>
            </Box>

            {/* FAB para tirar os 3 prints */}
            <Fab
                color="success"
                aria-label="snapshot"
                onClick={handleTakeSnapshots}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1300
                }}
            >
                <PhotoCameraIcon />
            </Fab>

            {
                sentSeedsData && sentSeedsData.length > 0 &&
                <>
                    <Paper elevation={8}
                        sx={{
                            margin: '10px 0px',
                            width: '100%',
                            borderRadius: '6px',
                            boxShadow: theme.shadows[8],                // 👈 força sombra
                            border: `1px solid ${theme.palette.divider}` // 👈 borda visível
                        }}
                    >

                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            sx={{
                                backgroundColor: colors.blueOrigin[400],
                                color: colors.grey[900],
                                minWidth: "1581px",
                                width: '100%',
                                borderRadius: '6px'
                            }}
                        >
                            <Typography
                                variant="h1"
                                color={"whitesmoke"}
                                sx={{ alignSelf: "center", justifySelf: "center" }}
                            >
                                Sementes
                            </Typography>
                        </Box>
                    </Paper>
                    <DashboardTable data={sentSeedsData} isLoading={isLoadingSeed} dataToReport={dataToReport} />
                </>
            }
            {
                dataFromApi && dataFromApi.length > 0 &&
                <>
                    <Box mt={5} mb={2}>
                        <Switch
                            checked={togllePlantioColheitaView}
                            onChange={() => setTogllePlantioColheitaView(!togllePlantioColheitaView)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            color="success"
                        />
                    </Box>
                    <Divider variant="fullWidth" />
                    <Box ref={plannerRef}
                        sx={{
                            p: 2, // dá um respiro em volta do Paper
                            // bgcolor: theme.palette.background.default, // mesmo fundo da tela
                        }}
                    >

                        <Paper elevation={8}
                            sx={{
                                margin: '0px 0px 10px 0px',
                                width: '100%',
                                borderRadius: '6px'
                            }}
                        >
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                p={1}
                                sx={{
                                    backgroundColor: togllePlantioColheitaView ? colors.blueOrigin[400] : colors.greenAccent[`${isDark ? 700 : 300}`],
                                    color: colors.grey[900],
                                    minWidth: "1581px",
                                    width: '100%',
                                    borderRadius: '6px'
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    color={"whitesmoke"}
                                    sx={{ alignSelf: "center", justifySelf: "center" }}
                                >
                                    {togllePlantioColheitaView ? "Planejamento Plantio" : 'Previsão Colheita'}
                                </Typography>
                            </Box>
                        </Paper>

                        {/* PRIMEIRO PRINT: Tabela planner + data */}
                        <Box
                            sx={{ width: '100%' }}
                        >
                            <Paper elevation={8} sx={{ width: '100%', marginBottom: '10px', padding: '10px' }}>
                                <TableComonent
                                    data={dataFromApi}
                                    onlyFarmsArr={onlyFarmsArr}
                                    type={"planner"}
                                    dataToReport={dataToReport}
                                />
                            </Paper>
                            <Box justifyContent="flex-end" sx={{ marginTop: '5px', width: '100%', display: 'flex' }}>
                                <Typography color={colors.primary[300]} fontSize={'10px'}>{dataToReport}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </>
            }
            {
                dataToBarChart && dataToBarChart.length > 0 && (
                    <>
                        {/* SEGUNDO PRINT: Acompanhamento Plantio + gráfico + totais + data */}
                        <Box
                            ref={acompanhamentoRef}
                            sx={{
                                width: '100%',
                                p: 2, // dá um respiro em volta do Paper
                                // bgcolor: theme.palette.background.default, // mesmo fundo da tela

                            }}
                        >
                            <Paper elevation={8}
                                sx={{
                                    margin: '30px 0px 10px 0px',
                                    width: '100%',
                                    borderRadius: '6px'
                                }}
                            >
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    p={1}
                                    sx={{
                                        backgroundColor: colors.blueOrigin[400],
                                        color: colors.grey[900],
                                        minWidth: "1581px",
                                        width: '100%',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <Typography
                                        variant="h1"
                                        color={"whitesmoke"}
                                        sx={{ alignSelf: "center", justifySelf: "center" }}
                                    >
                                        Acompanhamento Plantio
                                    </Typography>
                                </Box>
                            </Paper>
                            <Paper elevation={8} sx={{ width: '100%', marginBottom: '10px' }}>
                                <BarPlantioPlanner data={dataToBarChart} />
                            </Paper>

                            <TotalCOmp totalsSet={totalsSet} />

                            <Box justifyContent="flex-end" sx={{ marginTop: '5px', width: '100%', display: 'flex' }}>
                                <Typography color={colors.primary[300]} fontSize={'10px'}>{dataToReport}</Typography>
                            </Box>
                        </Box>
                    </>
                )
            }
            {
                dataFromApi && dataFromApi.length > 0 &&
                <>
                    {/* TERCEIRO PRINT: Realizado + tabela executado + data */}
                    <Box
                        ref={realizadoRef}
                        sx={{
                            width: '100%',
                            p: 2, // dá um respiro em volta do Paper
                            // bgcolor: theme.palette.background.default, // mesmo fundo da tela
                        }}
                    >
                        <Paper elevation={8}
                            sx={{
                                margin: '30px 0px 10px 0px',
                                width: '100%',
                                borderRadius: '6px',
                            }}
                        >
                            <Box
                                display={"flex"}
                                justifyContent={"center"}
                                p={1}
                                sx={{
                                    backgroundColor: isDark ? colors.greenAccent[600] : colors.greenAccent[400],
                                    color: colors.grey[900],
                                    minWidth: "1581px",
                                    width: '100%',
                                    borderRadius: '6px'
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    color={"whitesmoke"}
                                    sx={{ alignSelf: "center", justifySelf: "center" }}
                                >
                                    Realizado
                                </Typography>
                            </Box>
                        </Paper>
                        <Paper elevation={8} sx={{ width: '100%', marginBottom: '10px', padding: '10px' }}>
                            <TableComonent
                                data={dataToBarChartPlanned}
                                onlyFarmsArr={onlyFarmsArr}
                                type={"executed"}
                                dataExec={groupExecutedByWeek(executedAreaArr)}
                            />
                        </Paper>
                        <Box justifyContent="flex-end" sx={{ marginTop: '3px', width: '100%', display: 'flex' }}>
                            <Typography color={colors.primary[300]} fontSize={'10px'}>{dataToReport}</Typography>
                        </Box>
                    </Box>
                </>
            }
        </Box>
    );
};

export default PlantioAtual;
