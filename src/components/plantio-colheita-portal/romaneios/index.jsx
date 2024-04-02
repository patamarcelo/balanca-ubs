import { Box, Typography, useTheme } from "@mui/material";
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

const RomaneiosPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [isLoadingHome, setIsLoading] = useState(true);
    const useData = useSelector(selectRomaneiosLoads);
    const [filteredUserData, setfilteredUserData] = useState([]);
    const [resumeByFarm, setResumeByFarm] = useState({});
    const [totalFarms, setTotalFarms] = useState(0);
    const [filterDataArr, setFilterDataArr] = useState(null);

    useEffect(() => {
        let total = 0;
        Object.keys(resumeByFarm).forEach((farm) => {
            total += resumeByFarm[farm];
        });
        setTotalFarms(total);
    }, [resumeByFarm]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
        setFilterDataArr(null);
    }, []);

    useEffect(() => {
        if (useData.length > 0) {
            if (filterDataArr) {
                setfilteredUserData(
                    useData
                        .filter((data) => data.uploadedToProtheus === false)
                        .filter((data) =>
                            filterDataArr
                                ? data.syncDate.toDate().toISOString().slice(0, 10) ===
                                filterDataArr
                                : data.syncDate.length > 0
                        )
                );
            } else {
                setfilteredUserData(
                    useData.filter((data) => data.uploadedToProtheus === false)
                );
            }
        }
    }, [useData, filterDataArr]);

    const handleUpdateCarga = async (event, cargaDetail) => {
        if (
            window.confirm(
                `Confirma o lançamento da carga: \n ${cargaDetail.relatorioColheita} - ${cargaDetail.placa} - ${cargaDetail.motorista}`
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
            {filteredUserData.length > 0 && (
                <>
                    <Box
                        display={"flex"}
                        flexDirection={"row"}
                        gap={"10px"}
                    >
                        {filterDataArr &&
                            (
                                <IconButton
                                    aria-label="delete"
                                    size="sm"
                                    color="warning"
                                    onClick={(e) => setFilterDataArr(null)}
                                    style={{ padding: "2px" }}
                                >
                                    <CancelIcon fontSize="inherit" />
                                </IconButton>
                            )}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Data"
                                renderInput={(params) => <TextField size="small" {...params} />}
                                onChange={(newValue) =>
                                    setFilterDataArr(new Date(newValue).toISOString().slice(0, 10))
                                }
                                value={filterDataArr}
                            />
                        </LocalizationProvider>

                    </Box>
                    <Typography
                        variant="h1"
                        color={colors.textColor[100]}
                        sx={{ alignSelf: "center" }}
                    >
                        Romaneios
                    </Typography>
                    <Box
                        display={"grid"}
                        flexDirection={"column"}
                        gridTemplateColumns={"1fr auto"}
                        alignItems={"end"}
                        width={"100%"}
                    >
                        <Box>
                            {resumeByFarm &&
                                Object.keys(resumeByFarm).map((farm) => {
                                    return (
                                        <Typography variant="h6" color={colors.textColor[100]}>
                                            {farm.replace("Projeto", "")}:
                                            <span style={{ marginLeft: "5px" }}>
                                                <b>{resumeByFarm[farm]}</b>
                                            </span>
                                        </Typography>
                                    );
                                })}
                        </Box>
                        {resumeByFarm && (
                            <Box>
                                <Typography variant="h5" color={colors.textColor[100]}>
                                    Geral: <b>{totalFarms}</b>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </>
            )}

            <RomaneiosTable
                theme={theme}
                colors={colors}
                data={filteredUserData}
                handleUpdateCarga={handleUpdateCarga}
                setResumeByFarm={setResumeByFarm}
                filterDataArr={filterDataArr}
                setFilterDataArr={setFilterDataArr}
            />
        </Box>
    );
};

export default RomaneiosPage;
