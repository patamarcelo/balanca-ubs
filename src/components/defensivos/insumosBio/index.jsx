import { Typography, Box, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


import { tokens } from "../../../theme";

import { useEffect, useState } from "react";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";

import { nodeServerSrd, nodeServer } from "../../../utils/axios/axios.utils";



import TableBio from "./table-bio";


import formatProds, { dataFromFarm } from './support-bio.js'

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

    const [protDataToTable, setprotDataToTable] = useState([]);
    useEffect(() => {
        const handleSearch = async () => {
            setloadingDataProtheus(true);
            const paramsQuery = { products: 'bio' }
            try {
                nodeServerSrd
                    .get("/get-defensivos-from-srd", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        },
                        params: {
                            paramsQuery
                        }
                    })
                    .then(res => {
                        setdataFromProtheus(res.data.itens);
                        setloadingDataProtheus(false);
                    }).catch((err) => {
                        setloadingDataProtheus(false)
                        window.alert('erro ao pegar os dados: ', err)
                    })
            } catch (error) {
                console.log("erro ao pegar os dados: ", error);
                setloadingDataProtheus(false);
            } finally {
                // setIsLoading(false);
            }
        };

        handleSearch()
    }, [user]);

    useEffect(() => {
        const getTrueApi = async () => {
            try {
                setLoadinData(true);
                await nodeServer
                    .get("/data-open-apps-only-bio", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                            "X-Firebase-AppCheck": user.accessToken
                        }
                        // params: {
                        // 	safraCiclo
                        // }
                    })
                    .then((res) => {
                        console.log('data bio from farm: ' + res.data)
                        setDataFromFam(res.data);
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log("Erro ao consumir a API", err);
            } finally {
                setLoadinData(false);
            }
        };
        getTrueApi();
    }, [user]);


    useEffect(() => {
        // setDataFromFam(biofarm)
        // setdataFromProtheus(bioprot.itens)
        // setLoadinData(false);
        // setloadingDataProtheus(false)
    }, []);


    useEffect(() => {
        if (dataFromFam && dataFromFam.length > 0) {
            //data from protheus
            const prodsArr = formatProds(dataFromProtheus)
            setprotDataToTable(prodsArr)

            //data from farmbox
            const prodFarmArr = dataFromFarm(dataFromFam)
            console.log('array of prods from farm: ', prodFarmArr)
            console.log('array of prods from protheus: ', prodsArr)


            if (prodsArr.length > 0 && prodFarmArr.length > 0) {
                const mergeProducts = prodsArr.map((prods) => {
                    const findInFarmArray = prodFarmArr.find((farm) => farm.input_id === Number(prods.id_farm_box))
                    let objToAdd = {}
                    if (findInFarmArray) {
                        objToAdd = {
                            quantity_farmbox: findInFarmArray.quantity
                        }
                    } else {
                        objToAdd = {
                            quantity_farmbox: 0
                        }
                    }
                    return ({
                        ...prods, ...objToAdd
                    })
                })

                const indsInMergedProds = mergeProducts.map((data) => Number(data.id_farm_box))

                const includeOthersFromFarm = prodFarmArr.filter((e) => !indsInMergedProds.includes(e.input_id))
                console.log('not indcludes: ', includeOthersFromFarm)
                console.log('ids Includes: ', indsInMergedProds)

                const prodFromFarmAdjust = includeOthersFromFarm.map((data) => {
                    return ({
                        descricao_produto: data.name,
                        quantity_farmbox: data.quantity,
                        id_farm_box: data.input_id
                    })
                })
                const finalArrayOfProds = [...mergeProducts.sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto)), ...prodFromFarmAdjust.sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto))]

                setprotDataToTable(finalArrayOfProds)

            }

        }
    }, [dataFromFam, dataFromProtheus]);

    useEffect(() => {
        if (dataFromProtheus.length > 0) {
            const filiais = [{ cod_filial: '0209', des_filial: 'UBS' }];
            const newArr = dataFromProtheus?.map((item) => {
                const newArr = item.filiais;
                let hasHere = false;
                let farmProd = {};
                let farmOrigName;
                newArr.forEach((filial) => {
                    if (filiais.filter((data) => data.cod_filial === filial.cod_filial).length === 0) {
                        const objToAdd = { cod_filial: filial.cod_filial, des_filial: filial.desc_filial }
                        filiais.push(objToAdd)
                    }
                });
                return { ...item, hasHere, ...farmProd, farmOrigName };
            });
            // console.log('Filiais: ', filiais)
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
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: useThemeHere !== 'dark' && "whitesmoke",
                borderRadius: "8px",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: '30px'
                    // alignItems: "center",
                }}
            >
                <Typography color={colors.textColor[100]} variant="h1">Biológicos</Typography>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    justifyContent: "center",
                    display: 'flex',
                    // backgroundColor: 'red'
                }}
            >
                <TableBio data={protDataToTable} />
            </Box>
        </Box>
    );
}

export default InsumosBioPage;