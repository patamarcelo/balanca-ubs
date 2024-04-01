import { Box, useTheme } from "@mui/material";
import { tokens } from '../../../theme'

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import RomaneiosTable from "./table-romaneios";

import CircularProgress from "@mui/material/CircularProgress";
import { handleUpdateRomaneioCheck } from "../../../utils/firebase/firebase.datatable";


import { selectRomaneiosLoads } from "../../../store/trucks/trucks.selector";

import toast from "react-hot-toast";


const RomaneiosPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [isLoadingHome, setIsLoading] = useState(true);
    const useData = useSelector(selectRomaneiosLoads)
    const [filteredUserData, setfilteredUserData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 200)
    }, []);

    useEffect(() => {
        if (useData.length > 0) {
            setfilteredUserData(useData.filter((data) => data.uploadedToProtheus === false))
        }
    }, [useData]);

    const handleUpdateCarga = async (event, cargaDetail) => {
        if(window.confirm(`Confirma o lançamento da carga: \n ${cargaDetail.relatorioColheita} - ${cargaDetail.placa} - ${cargaDetail.motorista}`) === true){            
            console.log(cargaDetail)
            const updatedData = { ...cargaDetail, uploadedToProtheus: true }
            try {
                await handleUpdateRomaneioCheck(event, cargaDetail.id, updatedData)
                const newArr = useData.filter((data) => data.id !== cargaDetail.id)
                setfilteredUserData(newArr.filter((data) => data.uploadedToProtheus === false))
                toast.success(`Romaneio ${cargaDetail.relatorioColheita} - ${cargaDetail.fazendaOrigem} atualizado com sucesso!!`, {
                    position: "top-center"
                });
            } catch (error) {
                alert('Erro ao editar a Carga', error)
            }
        }
    }

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
                <CircularProgress
                    sx={{ color: colors.blueAccent[100] }}
                />
            </Box>
        )
    }

    return (
        <Box
            width={"100%"}
            height={"100%"}
            justifyContent={"center"}
            display={"flex"}
            alignItems={filteredUserData.length === 0 ? "center" : "flex-start"}
            p={5}
        >
            <RomaneiosTable theme={theme} colors={colors} data={filteredUserData} handleUpdateCarga={handleUpdateCarga} />
        </Box>
    );
};

export default RomaneiosPage;
