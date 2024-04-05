import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../../theme";
import styles from "./tablesrd.module.css";

import CircularProgress from "@mui/material/CircularProgress";

import DateRange from "./date-range";
import { useState, useEffect } from "react";

import ResumoGeral from "./resumo-geral";
import TableSrd from "./table-srd";

import Divider from "@mui/material/Divider";
import SearchPage from "./serach-page";

const SRDPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [paramsQuery, setParamsQuery] = useState({
        dtIni: null,
        dtFim: null
    });

    const [dataArray, setDataArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [destArr, setdestArr] = useState([]);
    const [projArr, setprojArr] = useState();

    const [dataDisplay, setDataDisplay] = useState("");

    const formatDateIn = (date) => {
        const year = date?.slice(0, 4);
        const month = date?.slice(4, 6);
        const day = date?.slice(6, 8);
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const displayDatas = [
            formatDateIn(paramsQuery.dtIni),
            formatDateIn(paramsQuery.dtFim)
        ];
        const displayDataSet = [...new Set(displayDatas)];

        if (displayDataSet.length > 1) {
            setDataDisplay(`${displayDatas[0]} - ${displayDatas[1]}`);
        } else {
            setDataDisplay(`${displayDatas[0]}`);
        }
    }, [paramsQuery]);

    useEffect(() => {
        const formD = dataArray?.map((data) => {
            const dest = data.DESTINO.split("-")[0].trim();
            return { destino: dest, projeto: data.PROJETO };
        });
        const onlyDest = formD?.map((data) => data.destino).sort();
        const onlyProj = formD?.map((data) => data.projeto);
        setdestArr([...new Set(onlyDest)]);
        setprojArr([...new Set(onlyProj)]);
    }, [dataArray]);

    return (
        <Box p={2} height={"100%"}>
            <Box display={"flex"} flexDirection={"row"} gap={2}>
                <DateRange setParamsQuery={setParamsQuery} />
                <SearchPage
                    setIsLoading={setIsLoading}
                    setDataArray={setDataArray}
                    paramsQuery={paramsQuery}
                />
            </Box>

            {isLoading ? (
                <Box
                    display={"flex"}
                    width={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    height={"100%"}
                >
                    <CircularProgress sx={{ color: colors.primary[100] }} />
                </Box>
            ) : dataArray?.length > 0 ? (
                <Box height={"100%"} mb={5} pb={5} sx={{ backgroundColor: theme.palette.mode !== "dark" && 'white' }}>
                    {
                        <Box
                            sx={{
                                width: "100%",
                                // backgroundColor: 'red',
                                display: "flex",
                                flexDirection: "row",
                                padding: "15px 10px",
                                justifyContent: 'space-between',
                            }}
                            mb={4}
                            mt={4}
                        >
                            <Box width={"100%"} gap={"20px"}  display={"flex"} flexDirection={"row"}>

                            {destArr &&
                                destArr.map((dest, i) => {
                                    return <ResumoGeral key={i} dest={dest} data={dataArray}/>;
                                })}
                                </Box>
                                <Box width={"100%"} display={"flex"} justifyContent={"end"}>
                                    <ResumoGeral dest={"Geral"} data={dataArray}/>
                                </Box>
                        </Box>
                    }
                    <Box
                        width={"100%"}
                        justifyContent={"end"}
                        display={"flex"}
                        sx={{ marginBottom: "-40px" }}
                    >
                        <Typography variant="h5" color={colors.textColor[100]}>
                            {dataDisplay}
                        </Typography>
                    </Box>
                    {destArr.map((destino, i) => {
                        return (
                            <Box
                                key={i}
                                display={"flex"}
                                justifyContent={"center"}
                                flexDirection={"column"}
                                pb={i === destArr.length - 1 && 5}
                            >
                                <Divider textAlign="center">
                                    <Typography
                                        className={styles.destHeader}
                                        m={2}
                                        variant="h1"
                                        color={colors.textColor[100]}
                                    >
                                        {destino.length > 6
                                            ? destino.charAt(0).toUpperCase() +
                                            destino.slice(1).toLowerCase()
                                            : destino}
                                    </Typography>
                                </Divider>

                                {projArr.map((projeto, i) => {
                                    const lengthArr = dataArray
                                        .filter((data) => data.DESTINO.includes(destino))
                                        .filter((data) => data.PROJETO.includes(projeto));
                                    const totalScs = lengthArr.reduce(
                                        (acc, curr) => acc + curr.SACOS_SECOS,
                                        0
                                    );
                                    return (
                                        <>
                                            {dataArray
                                                .filter((data) => data.DESTINO.includes(destino))
                                                .filter((data) => data.PROJETO.includes(projeto))
                                                .length > 0 && (
                                                    <Box
                                                        key={i}
                                                        display={"flex"}
                                                        justifyContent={"center"}
                                                        flexDirection={"column"}
                                                    >
                                                        <Box
                                                            display={"flex"}
                                                            justifyContent={"space-between"}
                                                            alignItems={"end"}
                                                        >
                                                            <Box>
                                                                <Typography
                                                                    className={styles.destHeader}
                                                                    mb={0.4}
                                                                    variant="h4"
                                                                    color={colors.textColor[100]}
                                                                    fontWeight={"bold"}
                                                                >
                                                                    {projeto.charAt(0).toUpperCase() +
                                                                        projeto.slice(1).toLowerCase()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <TableSrd
                                                            data={dataArray
                                                                .filter((data) => data.DESTINO.includes(destino))
                                                                .filter((data) => data.PROJETO.includes(projeto))
                                                                .sort((a, b) => b.TICKET - a.TICKET)}
                                                        />
                                                        <Box
                                                            style={{ color: colors.textColor[100] }}
                                                            display={"flex"}
                                                            flexDirection={"row"}
                                                            gap={10}
                                                            borderTop={"1px solid black"}
                                                            pl={2}
                                                            ml={2}
                                                            mb={4}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                color={colors.textColor[100]}
                                                            >
                                                                <b>{lengthArr.length} Cargas</b>
                                                            </Typography>
                                                            <Typography
                                                                variant="h5"
                                                                color={colors.textColor[100]}
                                                            >
                                                                <b>
                                                                    {totalScs.toLocaleString("pt-br", {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    })}{" "}
                                                                    Scs
                                                                </b>
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                        </>
                                    );
                                })}
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Box
                    display={"flex"}
                    width={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    height={"100%"}
                >
                    <Typography variant="h2" color={colors.textColor[100]}>
                        Sem Dados
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default SRDPage;
