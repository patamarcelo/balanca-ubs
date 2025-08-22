import { Typography, Box, useTheme, TextField, Chip, Button, IconButton } from "@mui/material";
import { tokens } from "../../../theme";
import styles from "./tablesrd.module.css";

import CircularProgress from "@mui/material/CircularProgress";

import DateRange from "./date-range";
import { useState, useEffect } from "react";

import ResumoGeral from "./resumo-geral";
import TableSrd from "./table-srd";

import Divider from "@mui/material/Divider";
import SearchPage from "./serach-page";


import { CSVLink } from "react-csv";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import CancelIcon from "@mui/icons-material/Cancel";

import formatData from "./csv-format-data";
import { nodeServerSrd } from "../../../utils/axios/axios.utils";
import { exportAsJson, handleJsonData } from "./json-export";

import JsonFile from '../../../utils/assets/icons/json.png'
import MultiSelectFilter from "./filters";

const SRDPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [paramsQuery, setParamsQuery] = useState({
        dtIni: null,
        dtFim: null,
        ticket: ''
    });

    const [dataArray, setDataArray] = useState([]);
    const [filterDataArray, setFilterDataArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [destArr, setdestArr] = useState([]);
    const [projArr, setprojArr] = useState();
    const [filterImp, setFilterImp] = useState();
    const [csvData, setcsvData] = useState([]);
    const [jsonData, setJsonData] = useState([]);

    const [filteImp, setFilteImp] = useState();

    const [dataDisplay, setDataDisplay] = useState("");

    const [initialDate, setInitialDate] = useState();
    const [finalDate, setFinalDate] = useState();
    const [ticketApi, setTicketApi] = useState("");


    const [ticketPriorityOptions, setTicketPriorityOptions] = useState([]);
    const [projetosOptions, setProjetosOptions] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState([]);

    const handleStatusChange = (newSelection) => {
        setSelectedStatus(newSelection);
        // Aqui você pode adicionar a lógica para filtrar os tickets com base no novo status selecionado
        console.log('Projetos selecionados:', newSelection);
    };

    const handlePriorityChange = (newSelection) => {
        setSelectedPriority(newSelection);
        // Aqui você pode adicionar a lógica para filtrar os tickets com base na nova prioridade selecionada
        console.log('Tickets selecionadas:', newSelection);
    };
    const handleClearFilters = () => {
        setSelectedStatus([])
        setSelectedPriority([])
    }

    useEffect(() => {
        if (dataArray?.length > 0) {
            // const onlyTickets = dataArray.sort((a, b) => a.TICKET.localeCompare(b.TICKET)).map((data) => ({projeto: data.PROJETO, ticket: data.TICKET}))
            const onlyTickets = dataArray
                .sort((a, b) => {
                    // Primeiro compara pelo projeto
                    const projetoCompare = a.PROJETO.localeCompare(b.PROJETO);
                    if (projetoCompare !== 0) return projetoCompare;

                    // Se os projetos forem iguais, compara pelo ticket
                    return a.TICKET.localeCompare(b.TICKET);
                })
                .map(data => ({
                    projeto: data.PROJETO,
                    ticket: data.TICKET
                }));
            console.log('onlyTickets', onlyTickets)
            setTicketPriorityOptions(onlyTickets)

            const onlyProj = dataArray.sort((a, b) => a.PROJETO.localeCompare(b.PROJETO)).map((data) => data.PROJETO)
            const uniqueOnlyProj = [...new Set(onlyProj)]
            setProjetosOptions(uniqueOnlyProj)
        }
    }, [dataArray]);


    const handleSearch = async () => {
        setcsvData([])
        console.log("Buscar os dados", paramsQuery);
        setIsLoading(true);
        try {
            nodeServerSrd
                .get("/get-from-srd", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                    },
                    params: {
                        paramsQuery
                    }
                })
                .then(res => {
                    setDataArray(res.data.objects);
                    console.log(res.data.objects);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false)
                    window.alert('erro ao pegar os dados: ', err)
                })
        } catch (error) {
            console.log("erro ao pegar os dados: ", error);
            setIsLoading(false);
        } finally {
            // setIsLoading(false);
        }
    };

    const formatDateIn = (date) => {
        return date?.split('-').reverse().join('/');
        // const year = date?.slice(0, 4);
        // const month = date?.slice(5, 7);
        // const day = date?.slice(6, 8);
        // return `${day}/${month}/${year}`;
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
        const formD = filterDataArray?.map((data) => {
            const dest = data.DESTINO.trim().split("-")[0];
            return { destino: dest, projeto: data.PROJETO };
        });
        const onlyDest = formD?.map((data) => data?.destino?.trim()).sort();
        const onlyProj = formD?.map((data) => data.projeto);
        setdestArr([...new Set(onlyDest)]);
        setprojArr([...new Set(onlyProj)]);
    }, [filterDataArray]);

    const handleChangeImp = (data) => {
        setFilteImp(data.target.value.replace(',', '.'))
        const impureza = data.target.value.replace(',', '.')
        if (impureza) {
            setFilterImp(impureza)
        } else {
            setFilterImp()
        }
    }

    const handleChangeTicket = (data) => {
        const ticket = data.target.value
        if (ticket.length > 0 && Number(ticket) < 99999) {
            setTicketApi(ticket)
        }
        if (ticket.length === 0) {
            setTicketApi('')
        }
    }

    useEffect(() => {
        // if (filterImp > 0) {
        //     console.log(filterImp)
        //     const filterArr = dataArray.filter((data) => parseFloat(data.IMPUREZA_ENTRADA) >= parseFloat(filterImp))
        //     setFilterDataArray(filterArr)
        // } else {
        //     setFilterDataArray(dataArray)
        // }
        // Exemplo combinando todos os filtros
        const filteredArray = dataArray?.filter((data) => {
            // Filtro de IMPUREZA_ENTRADA
            const impurezaOk = filterImp > 0 ? parseFloat(data.IMPUREZA_ENTRADA) >= parseFloat(filterImp) : true;

            // Filtro de tickets
            const ticketOk = selectedPriority.length > 0 ? selectedPriority.includes(data.TICKET) : true;

            // Filtro de projetos
            const projetoOk = selectedStatus.length > 0 ? selectedStatus.includes(data.PROJETO) : true;

            // Retorna apenas se passar em todos os filtros
            return impurezaOk && ticketOk && projetoOk;
        });

        // Atualiza o estado
        setFilterDataArray(filteredArray);
        console.log('dados from SRD: ', filteredArray)
        if (filteredArray?.length > 0) {
            const csvData = formatData(filteredArray)
            setcsvData(csvData)

            const jsonData = handleJsonData(filteredArray)
            setJsonData(jsonData)
        }


    }, [filterImp, setFilterDataArray, dataArray, selectedStatus, selectedPriority]);



    const csvFileName = new Date().toLocaleString().replaceAll('/', '-').split(",")[0]

    const handlerClearData = () => {
        setParamsQuery(
            {
                dtIni: null,
                dtFim: null
            }
        )
        setInitialDate(null)
        setFinalDate(null)
        setTicketApi('')
        setFilterImp('')
        setFilterDataArray([])
        setDataArray([])
        setcsvData([])
    }

    const handlerKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <Box p={2} height={"100%"}>
            <Box display={"flex"} flexDirection={"row"} gap={2}
            // alignItems="center"
            >
                {
                    (initialDate || finalDate || ticketApi || filterImp) &&
                    <IconButton
                        aria-label="delete"
                        size="sm"
                        color="warning"
                        onClick={(e) => handlerClearData()}
                        style={{ padding: "2px" }}
                    >
                        <CancelIcon fontSize="inherit" />
                    </IconButton>
                }
                <DateRange
                    setParamsQuery={setParamsQuery}
                    initialDate={initialDate}
                    setInitialDate={setInitialDate}
                    finalDate={finalDate}
                    setFinalDate={setFinalDate}
                    ticketApi={ticketApi}
                    className={styles.dateRangeTransition}
                />
                <SearchPage
                    setIsLoading={setIsLoading}
                    setDataArray={setDataArray}
                    paramsQuery={paramsQuery}
                    setcsvData={setcsvData}
                    className={styles.dateRangeTransition}
                    handleSearch={handleSearch}
                />
                {
                    csvData.length > 0 && (
                        <Box alignSelf="center">
                            <CSVLink data={csvData} separator={";"} filename={`${csvFileName}_SRD.csv`}>
                                <FontAwesomeIcon
                                    icon={faFileExcel}
                                    color={colors.greenAccent[500]}
                                    size="xl"
                                    style={{ paddingLeft: "5px" }}
                                />
                            </CSVLink>
                        </Box>
                    )
                }
                {
                    csvData.length > 0 && (
                        <Box alignSelf="center" sx={{ cursor: 'pointer' }}>
                            <IconButton onClick={() => exportAsJson(jsonData)}>
                                <img
                                    src={JsonFile}
                                    alt="Export JSON"
                                    style={{
                                        width: "22px", // Set the width of the icon
                                        height: "22px", // Set the height of the icon
                                        filter: theme.palette.mode === 'dark' ? "brightness(0) invert(1)" : "brightness(0)"
                                    }}
                                />
                            </IconButton>
                        </Box>
                    )
                }


            </Box>

            <Box display={"flex"} flexDirection={"row"} gap={2} ml={initialDate || finalDate || ticketApi || filterImp ? 7 : 2} mt={2} alignItems={"center"}
                className={styles.dateRangeTransition}
            >
                <TextField type="number" id="ticketapi" label="Ticket" variant="outlined" size="small" onChange={handleChangeTicket} value={ticketApi} onKeyDown={handlerKeyDown} sx={{ width: '155px' }}
                />
                <TextField id="impureza" label="Impureza" variant="outlined" size="small" onChange={handleChangeImp} value={filterImp} onKeyDown={handlerKeyDown} sx={{ width: '155px' }} />
                {
                    filterDataArray?.length > 0 &&
                    <>
                        <Button onClick={() => setFilterImp(3)}>
                            <Chip label="3%" color="info" style={{ cursor: 'pointer' }} />
                        </Button>
                    </>
                }
                {
                    dataArray?.length > 0 &&
                    <>
                        <MultiSelectFilter
                            data={projetosOptions}
                            label="Projetos"
                            selectedItems={selectedStatus}
                            onSelectionChange={handleStatusChange}
                            height={300}
                            width={500}
                        />
                        <MultiSelectFilter
                            data={ticketPriorityOptions}
                            label="Ticktes"
                            selectedItems={selectedPriority}
                            onSelectionChange={handlePriorityChange}
                            width={100}
                            height={700}
                        />
                        {
                            (selectedPriority.length > 0 || selectedStatus.length > 0) &&
                            <IconButton
                                aria-label="delete"
                                size="sm"
                                color="warning"
                                onClick={(e) => handleClearFilters()}
                                style={{ padding: "2px" }}
                            >
                                <CancelIcon fontSize="inherit" />
                            </IconButton>
                        }
                    </>
                }
            </Box>
            <Divider style={{ marginTop: '10px' }} />

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
            ) : filterDataArray?.length > 0 ? (
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
                            <Box width={"100%"} gap={"20px"} display={"flex"} flexDirection={"row"}>

                                {destArr &&
                                    destArr.map((dest, i) => {
                                        return <ResumoGeral key={i} dest={dest} data={filterDataArray} />;
                                    })}
                            </Box>
                            <Box width={"100%"} display={"flex"} justifyContent={"end"}>
                                {
                                    destArr && destArr?.length > 1 && (
                                        <ResumoGeral dest={"Geral"} data={filterDataArray} />
                                    )
                                }
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
                                pb={i === destArr?.length - 1 && 5}
                            >
                                <Divider textAlign="center">
                                    <Typography
                                        className={styles.destHeader}
                                        m={2}
                                        variant="h1"
                                        color={colors.textColor[100]}
                                    >
                                        {destino?.length > 6
                                            ? destino.charAt(0).toUpperCase() +
                                            destino.slice(1).toLowerCase()
                                            : destino}
                                    </Typography>
                                </Divider>

                                {projArr.map((projeto, i) => {
                                    const lengthArr = filterDataArray
                                        .filter((data) => data.DESTINO.includes(destino))
                                        .filter((data) => data.PROJETO.includes(projeto));
                                    const totalScs = lengthArr.reduce(
                                        (acc, curr) => acc + curr.SACOS_SECOS,
                                        0
                                    );
                                    return (
                                        <>
                                            {filterDataArray
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
                                                            setFilterDataArray={setDataArray}
                                                            data={filterDataArray
                                                                .filter((data) => data.DESTINO.includes(destino))
                                                                .filter((data) => data.PROJETO.includes(projeto))
                                                                .sort((a, b) => {
                                                                    const dateA = new Date(a.DT_PESAGEM_TARA);
                                                                    const dateB = new Date(b.DT_PESAGEM_TARA);

                                                                    // First, sort by date (newest first)
                                                                    if (dateB - dateA !== 0) {
                                                                        return dateB - dateA;
                                                                    }

                                                                    // If dates are the same, sort by TICKET (descending)
                                                                    return b.TICKET - a.TICKET
                                                                })
                                                            }
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
                                                                <b>{lengthArr?.length}{lengthArr?.length === 1 ? " Carga" : " Cargas"}</b>
                                                            </Typography>
                                                            <Typography
                                                                variant="h5"
                                                                color={colors.textColor[100]}
                                                            >
                                                                <b>
                                                                    {totalScs.toLocaleString("pt-br", {
                                                                        minimumFractionDigits: 0,
                                                                        maximumFractionDigits: 0
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
