import { Box, Typography, useTheme, Divider, Button } from "@mui/material";
import { tokens } from "../../../theme";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import RomaneiosTable from "./table-romaneios";

import CircularProgress from "@mui/material/CircularProgress";
import { handleUpdateRomaneioCheck } from "../../../utils/firebase/firebase.datatable";

import { selectRomaneiosLoads } from "../../../store/trucks/trucks.selector";

import toast from "react-hot-toast";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ResumoHeader from "./resumo-header";

import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const RomaneiosPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [isLoadingHome, setIsLoading] = useState(true);
    const useData = useSelector(selectRomaneiosLoads);
    const [filteredUserData, setfilteredUserData] = useState([]);
    const [filterDataArrInit, setFilterDataArrInit] = useState(null);
    const [filterDataArr, setFilterDataArr] = useState(null);
    const [dataToCsv, setdataToCsv] = useState([]);

    const listSit = ["Descarregados", "Pendentes"];

    const formatDateIn = (dateInit, dataFinal) => {
        const date = dataFinal?.replaceAll("-", "");
        const year = date?.slice(0, 4);
        const month = date?.slice(4, 6);
        const day = date?.slice(6, 8);
        return `${day}/${month}/${year}`;
    };

    const handlerToday = () => {
        const newDate = new Date();
        const formDate = newDate.toLocaleDateString().replaceAll("/", "-");
        const reversed = formDate.split("-").reverse().join("-");
        setFilterDataArrInit(reversed);
        setFilterDataArr(reversed);
    };

    const handlerYesterday = () => {
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        var year = yesterday.getFullYear();
        var month = ("0" + (yesterday.getMonth() + 1)).slice(-2); // Adding 1 because getMonth returns zero-based index
        var day = ("0" + yesterday.getDate()).slice(-2);
        const reversed = year + "-" + month + "-" + day;
        setFilterDataArrInit(reversed);
        setFilterDataArr(reversed);
    };

    const handlerClearData = () => {
        setFilterDataArr(null);
        setFilterDataArrInit(null);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
        setFilterDataArr(null);
    }, []);

    useEffect(() => {
        console.log("data: ", filterDataArr);
        if (useData.length > 0) {
            if (filterDataArr && filterDataArrInit) {
                setfilteredUserData(
                    useData
                        .filter((data) => data.uploadedToProtheus === false)
                        .filter((data) => {
                            const addOndeDay = new Date(filterDataArr);
                            addOndeDay.setDate(addOndeDay.getDate() + 1);
                            return (
                                new Date(data.syncDate.toDate().toDateString()) <= addOndeDay
                            );
                        })
                        .filter(
                            (data) =>
                                new Date(data.syncDate.toDate().toDateString()) >=
                                new Date(filterDataArrInit)
                        )
                );
            } else if (filterDataArr != null) {
                setfilteredUserData(
                    useData
                        .filter((data) => data.uploadedToProtheus === false)
                        .filter((data) => {
                            const addOndeDay = new Date(filterDataArr);
                            addOndeDay.setDate(addOndeDay.getDate() + 1);
                            return (
                                new Date(data.syncDate.toDate().toDateString()) <= addOndeDay
                            );
                        })
                );
            } else if (filterDataArrInit != null) {
                setfilteredUserData(
                    useData
                        .filter((data) => data.uploadedToProtheus === false)
                        .filter((data) => {
                            console.log(
                                "dataString: , ",
                                new Date(data.syncDate.toDate()).toDateString()
                            );
                            console.log(
                                "dataStringInit: , ",
                                new Date(filterDataArrInit).toDateString()
                            );
                            console.log(
                                "isBigger??",
                                new Date(data.syncDate.toDate()).toDateString() >=
                                new Date(filterDataArrInit).toDateString()
                            );
                            return (
                                new Date(data.syncDate.toDate().toDateString()) >=
                                new Date(filterDataArrInit)
                            );
                        })
                );
            } else if (filterDataArrInit === null && filterDataArr === null) {
                setfilteredUserData(
                    useData.filter((data) => data.uploadedToProtheus === false)
                );
            }
        }
    }, [useData, filterDataArr, filterDataArrInit]);

    const handleUpdateCarga = async (event, cargaDetail) => {
        if (
            window.confirm(
                `Confirma o lançamento da carga: \n ${cargaDetail.relatorioColheita
                } - ${cargaDetail.placa} -${cargaDetail.fazendaOrigem
                } - ${cargaDetail.parcelasNovas
                    .sort((a, b) => a.localeCompare(b))
                    .join(", ")}\nTicket: ${cargaDetail?.ticket}`
            ) === true
        ) {
            console.log(cargaDetail);
            const updatedData = { ...cargaDetail, uploadedToProtheus: true };
            try {
                await handleUpdateRomaneioCheck(event, cargaDetail.id, updatedData);
                const newArr = useData.filter((data) => data.id !== cargaDetail.id);
                setfilteredUserData(
                    newArr.filter((data) => data.uploadedToProtheus === false)
                );
                toast.success(
                    `Romaneio ${cargaDetail.relatorioColheita} - ${cargaDetail.fazendaOrigem} atualizado com sucesso!!`,
                    {
                        position: "top-center"
                    }
                );
            } catch (error) {
                alert("Erro ao editar a Carga", error);
            }
        }
    };

    const formatWeight = (peso) => {
        if (peso > 0) {
            return Number(peso).toLocaleString("pt-BR") + " Kg";
        }
        return "-";
    };

    useEffect(() => {
        console.log("dados para CSV", filteredUserData);
        if (filteredUserData?.length > 0) {
            const dataCsv = [
                [
                    "Data",
                    "Romaneio",
                    "Ticket",
                    "Projeto",
                    "Parcelas",
                    "Placa",
                    "Motorista",
                    "Destino",
                    "Bruto",
                    "Tara",
                    "Líquido",
                    "Saída"
                ]
            ];

            const withEx = filteredUserData
                        .filter((data) => data.liquido > 0)
                        .sort((a, b) => a?.saida && b?.saida - a?.saida);
            const withWei = filteredUserData
                .filter((data) => data.saida.length === 0)
                .filter((data) => data.pesoBruto === "")
                .sort((a, b) => b.relatorioColheita - a.relatorioColheita);
            const noWei = filteredUserData
                .filter((data) => data.saida.length === 0)
                .filter((data) => data.pesoBruto > 0)
                .sort((a, b) => b.entrada.toMillis() - a.entrada.toMillis());
            const withExitArr = withEx.concat(noWei)
            const newArr = withExitArr.concat(withWei);

            newArr?.forEach((carga) => {
                const newDate =
                    carga?.pesoBruto > 0
                        ? carga.entrada.toDate().toLocaleString("pt-BR")
                        : carga.syncDate.toDate().toLocaleString("pt-BR");
                const ticket = carga?.ticket ? carga.ticket : "-";
                const placa = `${carga.placa.slice(0, 3)}-${carga.placa.slice(3, 12)}`;
                const pesoBruto = carga.pesoBruto
                    ? carga.pesoBruto
                    : 0;
                const pesoTara = carga.tara
                    ? carga.tara
                    : 0;
                const pesoLiquido = carga.liquido
                    ? carga.liquido
                    : 0;
                const saida = carga?.saida
                    ? carga?.saida.toDate().toLocaleString("pt-BR")
                    : "-";
                const newLine = [
                    newDate,
                    carga.relatorioColheita,
                    ticket,
                    carga.fazendaOrigem,
                    carga.parcelasNovas.sort((a, b) => a.localeCompare(b)).join(", "),
                    placa,
                    carga.motorista,
                    carga.fazendaDestino,
                    pesoBruto,
                    pesoTara,
                    pesoLiquido,
                    saida
                ];
                dataCsv.push(newLine);
            });
            setdataToCsv(dataCsv);
        }
    }, [filteredUserData]);


    if (isLoadingHome) {
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
                <CircularProgress sx={{ color: colors.blueAccent[100] }} />
            </Box>
        );
    }


    const csvFileName = new Date().toLocaleString().replaceAll('/', '-').split(",")[0]

    return (
        <Box
            width={"100%"}
            height={"100%"}
            // justifyContent={"center"}
            flexDirection={"column"}
            display={"flex"}
            alignItems={filteredUserData.length === 0 ? "center" : "flex-start"}
            p={5}
        >
            <Box
                display={"flex"}
                flexDirection={"row"}
                gap={"10px"}
                width={"100%"}
                alignItems={"center"}
            >
                {(filterDataArr || filterDataArrInit) && (
                    <IconButton
                        aria-label="delete"
                        size="sm"
                        color="warning"
                        onClick={(e) => handlerClearData()}
                        style={{ padding: "2px" }}
                    >
                        <CancelIcon fontSize="inherit" />
                    </IconButton>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Data Inicial"
                        renderInput={(params) => <TextField size="small" {...params} />}
                        onChange={(newValue) =>
                            setFilterDataArrInit(
                                new Date(newValue).toISOString().slice(0, 10)
                            )
                        }
                        value={filterDataArrInit}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Data Final"
                        renderInput={(params) => <TextField size="small" {...params} />}
                        onChange={(newValue) =>
                            setFilterDataArr(new Date(newValue).toISOString().slice(0, 10))
                        }
                        value={filterDataArr}
                    />
                </LocalizationProvider>
                <Button color="warning" variant="outlined" onClick={handlerYesterday}>
                    Ontem
                </Button>
                <Button color="success" variant="outlined" onClick={handlerToday}>
                    Hoje
                </Button>
                <Box>
                    <CSVLink data={dataToCsv} separator={";"} filename={`${csvFileName}_romaneios.csv`}>
                        <FontAwesomeIcon
                            icon={faFileExcel}
                            color={colors.greenAccent[500]}
                            size="xl"
                            style={{ paddingLeft: "5px" }}
                        />
                    </CSVLink>
                </Box>
            </Box>
            {filteredUserData.length > 0 && (
                <>
                    {(filterDataArr || filterDataArrInit) && (
                        <Box
                            sx={{
                                width: "100%",
                                marginBottom: "-20px",
                                display: "flex",
                                justifyContent: "end"
                            }}
                            mt={5}
                        >
                            <Typography variant="h5" color={colors.textColor[100]}>
                                {formatDateIn(filterDataArrInit, filterDataArr)}
                            </Typography>
                        </Box>
                    )}
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        p={1}
                        mb={3}
                        mt={3}
                        sx={{
                            backgroundColor: colors.blueOrigin[400],
                            color: colors.grey[900]
                        }}
                        width={"100%"}
                    >
                        <Typography
                            variant="h1"
                            color={"whitesmoke"}
                            sx={{ alignSelf: "center", justifySelf: "center" }}
                        >
                            Romaneios
                        </Typography>
                    </Box>
                </>
            )}
            {listSit.map((situacao) => {
                let newArr;
                const onlyTickets = filteredUserData.map((roms) => roms.ticket);
                const duplicates = onlyTickets?.filter(
                    (item, index) => onlyTickets?.indexOf(item) !== index
                );

                let onlyPlates;
                let duplicatesPlates;

                if (situacao === "Descarregados") {
                    newArr = filteredUserData
                        .filter((data) => data.liquido > 0)
                        .sort((a, b) => a?.saida && b?.saida - a?.saida);
                } else {
                    const withWei = filteredUserData
                        .filter((data) => data.saida.length === 0)
                        .filter((data) => data.pesoBruto === "")
                        .sort((a, b) => b.relatorioColheita - a.relatorioColheita);
                    const noWei = filteredUserData
                        .filter((data) => data.saida.length === 0)
                        .filter((data) => data.pesoBruto > 0)
                        .sort((a, b) => b.entrada.toMillis() - a.entrada.toMillis());
                    if (withWei.length > 0) {
                        const upArr = withWei.map((data, index) => {
                            let dataForm;
                            if (index === 0) {
                                dataForm = { ...data, firstOne: true }
                            } else {
                                dataForm = data
                            }
                            return dataForm
                        })
                        newArr = noWei.concat(upArr);
                    } else {
                        newArr = noWei.concat(withWei);
                    }
                    onlyPlates = filteredUserData
                        .filter((data) => data.saida.length === 0)
                        .map((roms) => roms.placa);
                    duplicatesPlates = onlyPlates?.filter(
                        (item, index) => onlyPlates?.indexOf(item) !== index
                    );
                    // newArr = filteredUserData.filter((data) => data.saida.length === 0).sort((a, b) => a.relatorioColheita - b.relatorioColheita && b.pesoBruto - a.pesoBruto);
                }

                const reduceFarms = newArr.reduce((acc, curr) => {
                    if (
                        acc.filter((data) => data.fazenda === curr.fazendaOrigem).length ===
                        0
                    ) {
                        const objToAdd = {
                            fazenda: curr.fazendaOrigem,
                            peso: curr.liquido,
                            pesoBruto: curr.pesoBruto,
                            count: 1
                        };
                        acc.push(objToAdd);
                    } else {
                        const findIndexOf = (e) => e.fazenda === curr.fazendaOrigem;
                        const getIndex = acc.findIndex(findIndexOf);
                        acc[getIndex]["peso"] += curr.liquido;
                        acc[getIndex]["pesoBruto"] += curr.pesoBruto;
                        acc[getIndex]["count"] += 1;
                    }
                    return acc;
                }, []);

                const totalQUant = reduceFarms.reduce(
                    (acc, curr) => acc + curr.count,
                    0
                );
                const totalQUantDescarregando = newArr.filter(
                    (data) => data.pesoBruto > 0
                );
                const totalQUantTransito = newArr.filter(
                    (data) => data.pesoBruto === ""
                );
                const totalPeso = reduceFarms.reduce((acc, curr) => acc + curr.peso, 0);
                return (
                    <Box width={"100%"}>
                        <Divider textAlign="center" style={{ marginBottom: "15px" }}>
                            <Typography
                                variant="h3"
                                color={colors.textColor[100]}
                                sx={{ fontWeight: "600" }}
                            >
                                {situacao}
                            </Typography>
                        </Divider>
                        {newArr.length > 0 ? (
                            <>
                                <Box mb={2} mt={2}>
                                    <ResumoHeader
                                        data={{
                                            fazenda: "Geral",
                                            peso: totalPeso,
                                            count: totalQUant
                                        }}
                                    />
                                    {situacao !== "Descarregados" && (
                                        <Box display={"flex"} flexDirection={"row"} gap={2}>
                                            <ResumoHeader
                                                data={{
                                                    fazenda: "Descarregando",
                                                    count: totalQUantDescarregando.length
                                                }}
                                                mtComp={2}
                                            />
                                            <ResumoHeader
                                                data={{
                                                    fazenda: "Trânsito",
                                                    count: totalQUantTransito.length
                                                }}
                                                mtComp={2}
                                            />
                                        </Box>
                                    )}
                                </Box>
                                <Box
                                    display={"grid"}
                                    gridTemplateColumns={"repeat(4, 250px)"}
                                    mt={2}
                                    mb={2}
                                    columnGap={2}
                                    rowGap={"15px"}
                                >
                                    {reduceFarms
                                        .sort((b, a) => a.count - b.count)
                                        .map((data, i) => {
                                            return <ResumoHeader key={i} data={data} />;
                                        })}
                                </Box>
                                <RomaneiosTable
                                    theme={theme}
                                    colors={colors}
                                    data={newArr}
                                    handleUpdateCarga={handleUpdateCarga}
                                    filterDataArr={filterDataArr}
                                    setFilterDataArr={setFilterDataArr}
                                    duplicates={duplicates}
                                    duplicatesPlates={duplicatesPlates}
                                />
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "200px"
                                    // backgroundColor: colors.greenAccent[400]
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    color={colors.greenAccent[300]}
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {situacao === "Descarregados"
                                        ? "Nenhum veículo descarregado do período selecionado"
                                        : "Sem Cargas Pendentes"}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default RomaneiosPage;
