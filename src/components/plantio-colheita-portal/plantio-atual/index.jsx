import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from 'react'

import { tokens } from "../../../theme";
import BarPlantioPlanner from "./bar-chart-plantio-comp.jsx";

import { dataPlannerHandler, consolidateData, groupExecutedByWeek } from './data-handler.js'
import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";

import TableComonent from './planned-plantio-table'


const PlantioAtual = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isDark = theme.palette.mode === 'dark'

    const [isLoading, setIsLoading] = useState(false);
    const [dataFromApi, setDataFromApi] = useState([]);
    const [onlyFarmsArr, setOnlyFarmsArr] = useState([]);
    const [executedAreaArr, setExecutedAreaArr] = useState([]);

    const [dataToBarChart, setDataToBarChart] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)
                await djangoApi
                    .get("plantio/get_plantio_planner_data/", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        }
                    })
                    .then((res) => {
                        console.log('data planner: ', res.data);
                        const newData = dataPlannerHandler(res.data.dados.qs_planned)
                        setOnlyFarmsArr(res.data.dados.qs_planned_projetos.sort((b, a) => b.replace('Projeto').localeCompare(a.replace('Projeto'))))
                        setExecutedAreaArr(res.data.dados.qs_executed_area)
                        setDataFromApi(newData)
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
        console.log('data from api', dataFromApi)
        console.log('data from api', executedAreaArr)
        if (executedAreaArr.length > 0 && dataFromApi.length > 0) {
            const newArr = consolidateData(dataFromApi, executedAreaArr)
            setDataToBarChart(newArr)
        }
    }, [dataFromApi, executedAreaArr]);

    if (isLoading) {
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
        )
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
            {
                dataFromApi && dataFromApi.length > 0 &&
                <>
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        p={1}
                        mt={3}
                        sx={{
                            backgroundColor: colors.blueOrigin[400],
                            color: colors.grey[900],
                            minWidth: "1581px",
                            width: '100%',
                        }}
                    >
                        <Typography
                            variant="h1"
                            color={"whitesmoke"}
                            sx={{ alignSelf: "center", justifySelf: "center" }}
                        >
                            Planejamento Plantio
                        </Typography>
                    </Box>
                    <TableComonent data={dataFromApi} onlyFarmsArr={onlyFarmsArr} type={"planner"} />
                </>
            }
            {
                dataToBarChart && dataToBarChart.length > 0 && (
                    <>
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            p={1}
                            mt={3}
                            sx={{
                                backgroundColor: colors.blueOrigin[400],
                                color: colors.grey[900],
                                minWidth: "1581px",
                                width: '100%',
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
                        <BarPlantioPlanner data={dataToBarChart} />
                    </>
                )
            }
            {
                dataFromApi && dataFromApi.length > 0 &&
                <>
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        p={1}
                        mt={3}
                        sx={{
                            backgroundColor: isDark ? colors.greenAccent[600] : colors.greenAccent[400],
                            color: colors.grey[900],
                            minWidth: "1581px",
                            width: '100%',
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
                    <TableComonent data={dataFromApi} onlyFarmsArr={onlyFarmsArr} type={"executed"} dataExec={groupExecutedByWeek(executedAreaArr)}/>
                </>
            }
        </Box>
    );
}

export default PlantioAtual;