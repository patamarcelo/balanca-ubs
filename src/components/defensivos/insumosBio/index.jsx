import { Typography, Box, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


import { tokens } from "../../../theme";

import { useEffect, useState } from "react";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";

import { nodeServerSrd, nodeServer } from "../../../utils/axios/axios.utils";

import bioprot from './bio-prot.json'
import biofarm from './bio-farm.json'

const InsumosBioPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const useThemeHere = theme.palette.mode

    const user = useSelector(selectCurrentUser);

    const [loadingData, setLoadinData] = useState(true);
    const [dataFromFam, setDataFromFam] = useState([]);

    const [loadingDataProtheus, setloadingDataProtheus] = useState(true);
    const [dataFromProtheus, setdataFromProtheus] = useState([]);

    const [filteredProdcuts, setFilteredProdcuts] = useState([]);
    // useEffect(() => {
    //     const handleSearch = async () => {
    //         setloadingDataProtheus(true);
    //         const paramsQuery = { products: 'bio' }
    //         try {
    //             nodeServerSrd
    //                 .get("/get-defensivos-from-srd", {
    //                     headers: {
    //                         Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
    //                     },
    //                     params: {
    //                         paramsQuery
    //                     }
    //                 })
    //                 .then(res => {
    //                     console.log('biológicos', res.data)
    //                     setdataFromProtheus(res.data);
    //                     setloadingDataProtheus(false);
    //                 }).catch((err) => {
    //                     setloadingDataProtheus(false)
    //                     window.alert('erro ao pegar os dados: ', err)
    //                 })
    //         } catch (error) {
    //             console.log("erro ao pegar os dados: ", error);
    //             setloadingDataProtheus(false);
    //         } finally {
    //             // setIsLoading(false);
    //         }
    //     };

    //     handleSearch()
    // }, [user]);

    // useEffect(() => {
    //     const getTrueApi = async () => {
    //         try {
    //             setLoadinData(true);
    //             await nodeServer
    //                 .get("/data-open-apps-only-bio", {
    //                     headers: {
    //                         Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
    //                         "X-Firebase-AppCheck": user.accessToken
    //                     }
    //                     // params: {
    //                     // 	safraCiclo
    //                     // }
    //                 })
    //                 .then((res) => {
    //                     console.log('data bio from farm: ' + res.data)
    //                     setDataFromFam(res.data);
    //                 })
    //                 .catch((err) => console.log(err));
    //         } catch (err) {
    //             console.log("Erro ao consumir a API", err);
    //         } finally {
    //             setLoadinData(false);
    //         }
    //     };
    //     getTrueApi();
    // }, [user]);


    useEffect(() => {
        setDataFromFam(biofarm)
        setdataFromProtheus(bioprot.itens)
        setLoadinData(false);
        setloadingDataProtheus(false)
    }, []);


    useEffect(() => {
        // console.log("dataFromFarm", dataFromFam);
        // console.log("dataFromprot", dataFromProtheus);
    }, [dataFromFam, dataFromProtheus]);

    useEffect(() => {
        if(dataFromProtheus.length > 0) {
                const newArr = dataFromProtheus?.map((item) => {
                    const newArr = item.filiais;
                    let hasHere = false;
                    let farmProd = {};
                    let farmOrigName;
                    newArr.forEach((filial) => {
                        console.log(filial)
                    });
                    return { ...item, hasHere, ...farmProd, farmOrigName };
                });
                console.table('newARR: ', newArr);
                setFilteredProdcuts(newArr);
            }
    }, [dataFromProtheus]);

    if (loadingData || loadingDataProtheus) {
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
                    size={30}
                    sx={{
                        margin: "0px 10px",
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
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
                backgroundColor: useThemeHere !== 'dark' && "whitesmoke",
                borderRadius: "8px",
            }}
        >
            <Typography color={colors.textColor[100]} variant="h1">Insumos Bio Page</Typography>
        </Box>
    );
}

export default InsumosBioPage;