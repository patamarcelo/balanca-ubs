import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from 'react'

import { tokens } from "../../../theme";
import MyBarChart from './chart-test'

import { dataPlannerHandler } from './data-handler.js'
import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";

import TableComonent from './planned-plantio-table'


const PlantioAtual = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [isLoading, setIsLoading] = useState(false);
    const [dataFromApi, setDataFromApi] = useState([]);
    const [onlyFarmsArr, setOnlyFarmsArr] = useState([]);

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
    }, [dataFromApi]);

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
                            minWidth: "1365px",
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
                    <TableComonent data={dataFromApi} onlyFarmsArr={onlyFarmsArr} />
                </>
            }
        </Box>
    );
}

export default PlantioAtual;