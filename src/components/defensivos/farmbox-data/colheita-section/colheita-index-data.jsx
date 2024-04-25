import { Box, useTheme, Typography, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "../../../../theme";

import { nodeServer } from "../../../../utils/axios/axios.utils";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../../../store/plantio/plantio.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";

import handlerDataColheita from "./colheita-handler";

import Accordion from "@mui/material/Accordion";
// import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const ColheitaPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const safraCiclo = useSelector(selectSafraCiclo);
    const user = useSelector(selectCurrentUser);

    const [isLoading, setIsLoading] = useState(true);
    const [dataColheita, setDataColheita] = useState([]);
    const [totalByFarmData, setTotalByFarmData] = useState([]);
    const [formatedApsName, setFormatedApsName] = useState([]);
    const [formatedExtratoCsv, setFormatedExtratoCsv] = useState([]);
    const [totalGeralData, setTotalGeralData] = useState(0);

    const getPlantioData = async () => {
        try {
            setIsLoading(true);
            console.log("pegando os dados");
            await nodeServer
                .get("/data-detail-plantio", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                        "X-Firebase-AppCheck": user.accessToken
                    },
                    params: {
                        safraCiclo
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    const {
                        sortedArr,
                        totalByFarm,
                        totalGeral,
                        onlyFormatAps,
                        formatExtratoColheita
                    } = handlerDataColheita(res.data);
                    setDataColheita(sortedArr);
                    setTotalByFarmData(totalByFarm);
                    setTotalGeralData(totalGeral);
                    setFormatedApsName(onlyFormatAps);
                    setFormatedExtratoCsv(formatExtratoColheita);
                })
                .catch((err) => console.log(err));
            setIsLoading(false);
        } catch (err) {
            console.log("Erro ao consumir a API", err);
        } finally {
            setIsLoading(false);
        }
    };
    const handleRefresh = () => {
        getPlantioData();
    };

    useEffect(() => {
        const getPlantioData = async () => {
            try {
                setIsLoading(true);
                await nodeServer
                    .get("/data-detail-plantio", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                            "X-Firebase-AppCheck": user.accessToken
                        },
                        params: {
                            safraCiclo
                        }
                    })
                    .then((res) => {
                        console.log(res.data)
                        const { sortedArr, totalByFarm, totalGeral, onlyFormatAps, formatExtratoColheita } = handlerDataColheita(res.data)
                        console.log(sortedArr)
                        setDataColheita(sortedArr)
                        setTotalByFarmData(totalByFarm)
                        setTotalGeralData(totalGeral)
                        setFormatedApsName(onlyFormatAps)
                        setFormatedExtratoCsv(formatExtratoColheita)
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log("Erro ao consumir a API", err);
            } finally {
                setIsLoading(false);
            }
        };
        getPlantioData()
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    flexGrow: 1
                    // border: `1px solid ${colors.textColor[100]}`
                }}
            >
                <CircularProgress
                    size={40}
                    sx={{
                        margin: "-10px 10px",
                        color: (theme) =>
                            colors.greenAccent[theme.palette.mode === "dark" ? 200 : 800]
                    }}
                />
            </Box>
        );
    }
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "baseline",
                width: "100%",
                height: "100%"
            }}
        >
            <Box mt={5} sp={2} pb={0} width={"100%"} 
            sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}
            >
                <Box>

                <CSVLink
                    data={formatedExtratoCsv}
                    separator={";"}
                    filename={"Farm-Colheita.csv"}
                    >
                    <FontAwesomeIcon icon={faFileExcel} color={colors.greenAccent[500]} size="xl" style={{paddingLeft: '5px'}} />
                </CSVLink>
                    </Box>
                <Button onClick={handleRefresh} variant="outlined" color="success">
                    Atualizar
                </Button>
            </Box>
            {totalByFarmData?.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "baseline",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    <Box
                        sx={{
                            width: "100%"
                        }}
                    >
                        {totalByFarmData?.length > 0 &&
                            totalByFarmData.map((data, index) => {
                                return (
                                    <>
                                        <Accordion key={data.farmName} sx={{ width: "100%" }}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                            >
                                                <Typography
                                                    color={colors.textColor[100]}
                                                    variant="h4"
                                                    sx={{ width: "220px" }}
                                                >
                                                    {data.farmName.replace("Fazenda", "")}
                                                </Typography>{" "}
                                                <Typography
                                                    color={colors.textColor[100]}
                                                    variant="h4"
                                                    sx={{ width: "150px", textAlign: "right" }}
                                                >
                                                    {data.areaFazenda.toLocaleString("pt-br", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </Typography>
                                                <Typography
                                                    color={colors.textColor[100]}
                                                    variant="h4"
                                                    sx={{ width: "150px", textAlign: "right" }}
                                                >
                                                    {data.areaAplicada.toLocaleString("pt-br", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails
                                                sx={{
                                                    backgroundColor: "rgba(245,245,245,0.1)"
                                                }}
                                            >
                                                {formatedApsName.length > 0 &&
                                                    formatedApsName
                                                        .filter((apps) => apps.farmName === data.farmName)
                                                        .map((aps, i) => {
                                                            return (
                                                                <>
                                                                    <Box key={i} sx={{ marginLeft: "-8px" }}>
                                                                        <Typography
                                                                            variant="h5"
                                                                            sx={{
                                                                                backgroundColor: colors.blueOrigin[900],
                                                                                borderRadius: "8px",
                                                                                width: "100px",
                                                                                padding: "5px",
                                                                                textAlign: "center"
                                                                            }}
                                                                        >
                                                                            {aps.codeAp.replace("AP", "AP - ")}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box
                                                                        key={`${aps.codeAp}-${aps.farmName}`}
                                                                        display="grid"
                                                                        gridTemplateColumns="100px 100px 100px 100px"
                                                                        flexDirection="column"
                                                                        width="100%"
                                                                        m={1}
                                                                    >
                                                                        <Typography
                                                                            color={colors.textColor[100]}
                                                                            variant="h5"
                                                                            fontWeight={"bold"}
                                                                        >
                                                                            Parcela
                                                                        </Typography>
                                                                        <Typography
                                                                            color={colors.textColor[100]}
                                                                            variant="h5"
                                                                            sx={{ textAlign: "right" }}
                                                                            fontWeight={"bold"}
                                                                        >
                                                                            Área
                                                                        </Typography>
                                                                        <Typography
                                                                            color={colors.textColor[100]}
                                                                            variant="h5"
                                                                            sx={{ textAlign: "right" }}
                                                                            fontWeight={"bold"}
                                                                        >
                                                                            Colhido
                                                                        </Typography>
                                                                        <Typography
                                                                            color={colors.textColor[100]}
                                                                            variant="h5"
                                                                            sx={{ textAlign: "right" }}
                                                                            fontWeight={"bold"}
                                                                        >
                                                                            Aberto
                                                                        </Typography>
                                                                    </Box>
                                                                    {dataColheita?.length > 0 &&
                                                                        dataColheita
                                                                            .filter(
                                                                                (parcelas) =>
                                                                                    parcelas.farmName === data.farmName &&
                                                                                    parcelas.codeAp === aps.codeAp
                                                                            )
                                                                            .sort((a, b) =>
                                                                                a.parcela.localeCompare(b.parcela)
                                                                            )
                                                                            .map((detailsParcelas, ind) => {
                                                                                let duplicatedValues = dataColheita
                                                                                    .filter(
                                                                                        (parcelas) =>
                                                                                            parcelas.farmName ===
                                                                                            data.farmName
                                                                                    )
                                                                                    .map((parc) => parc.parcela);
                                                                                duplicatedValues.splice(
                                                                                    duplicatedValues.findIndex(
                                                                                        (a) => a === detailsParcelas.parcela
                                                                                    ),
                                                                                    1
                                                                                );
                                                                                const saldoAcolher =
                                                                                    detailsParcelas.areaTalhao -
                                                                                    detailsParcelas.areaAplicada;
                                                                                return (
                                                                                    <Box
                                                                                        key={`${detailsParcelas.parcela}-${detailsParcelas.areaTalhao}`}
                                                                                        display="grid"
                                                                                        gridTemplateColumns="100px 100px 100px 100px"
                                                                                        flexDirection="column"
                                                                                        width="100%"
                                                                                        m={1}
                                                                                    >
                                                                                        <Typography
                                                                                            color={
                                                                                                duplicatedValues.includes(
                                                                                                    detailsParcelas.parcela
                                                                                                )
                                                                                                    ? "red"
                                                                                                    : colors.textColor[100]
                                                                                            }
                                                                                            variant="h5"
                                                                                        >
                                                                                            {detailsParcelas.parcela}
                                                                                        </Typography>
                                                                                        <Typography
                                                                                            color={colors.textColor[100]}
                                                                                            variant="h5"
                                                                                            sx={{ textAlign: "right" }}
                                                                                        >
                                                                                            {detailsParcelas.areaTalhao.toLocaleString(
                                                                                                "pt-br",
                                                                                                {
                                                                                                    minimumFractionDigits: 2,
                                                                                                    maximumFractionDigits: 2
                                                                                                }
                                                                                            )}
                                                                                        </Typography>
                                                                                        <Typography
                                                                                            color={colors.textColor[100]}
                                                                                            variant="h5"
                                                                                            sx={{ textAlign: "right" }}
                                                                                        >
                                                                                            {detailsParcelas.areaAplicada ===
                                                                                                0
                                                                                                ? "-"
                                                                                                : detailsParcelas.areaAplicada.toLocaleString(
                                                                                                    "pt-br",
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2
                                                                                                    }
                                                                                                )}
                                                                                        </Typography>
                                                                                        <Typography
                                                                                            color={colors.textColor[100]}
                                                                                            variant="h5"
                                                                                            sx={{ textAlign: "right" }}
                                                                                        >
                                                                                            {saldoAcolher === 0
                                                                                                ? "-"
                                                                                                : saldoAcolher.toLocaleString(
                                                                                                    "pt-br",
                                                                                                    {
                                                                                                        minimumFractionDigits: 2,
                                                                                                        maximumFractionDigits: 2
                                                                                                    }
                                                                                                )}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                );
                                                                            })}
                                                                </>
                                                            );
                                                        })}
                                            </AccordionDetails>
                                        </Accordion>
                                    </>
                                );
                            })}
                    </Box>
                    <Box
                        sx={{
                            width: "30%",
                            flexGrow: 1,
                            alignSelf: "center",
                            textAlign: "center",
                            padding: "20px"
                        }}
                        ml={2}
                        mr={2}
                    >
                        {/* <Typography variant='h2'> */}
                        <Typography
                            variant="h2"
                            sx={{
                                backgroundColor: colors.blueOrigin[800],
                                borderRadius: "12px",
                                height: "100%",
                                padding: "50px"
                            }}
                        >
                            {totalGeralData.toLocaleString("pt-br", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ColheitaPage;
