import { Typography, Box, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


import { tokens } from "../../../theme";

import { useEffect, useState } from "react";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";

import djangoApi, { nodeServerSrd, nodeServer } from "../../../utils/axios/axios.utils";

// import biofarm from './bio-farm.json'
// import bioprot from './bio-prot.json'
// import biodjango from './bio-django-plant.json'

import TableBio from "./table-bio";


import formatProds, { dataFromFarm, dataFromDjangoArr } from './support-bio.js'

const InsumosBioPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const useThemeHere = theme.palette.mode

    const user = useSelector(selectCurrentUser);

    const [loadingData, setLoadinData] = useState(true);
    const [dataFromFam, setDataFromFam] = useState([]);

    const [loadingDataProtheus, setloadingDataProtheus] = useState(true);
    const [dataFromProtheus, setdataFromProtheus] = useState([]);

    const [dataFromDjango, setDataFromDjango] = useState([]);
    const [loadingDataDjango, setloadingDataDjango] = useState(true);

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
        const getTrueApi = async () => {
            try {
                setloadingDataDjango(true);
                await djangoApi
                    .get("/plantio/get_bio_prods_open_and_planted", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                        }
                        // params: {
                        // 	safraCiclo
                        // }
                    })
                    .then((res) => {
                        console.log('data bio from django: ' + res.data.data)
                        setDataFromDjango(res.data.data);
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log("Erro ao consumir a API", err);
            } finally {
                setloadingDataDjango(false);
            }
        };
        getTrueApi();
    }, [user]);


    // useEffect(() => {
    //     setDataFromFam(biofarm)
    //     setdataFromProtheus(bioprot.itens)
    //     setDataFromDjango(biodjango.data)

    //     setloadingDataDjango(false)
    //     setLoadinData(false);
    //     setloadingDataProtheus(false)
    // }, []);

    useEffect(() => {
        if (dataFromFam && dataFromFam.length > 0) {
            //data from protheus
            const prodsArr = formatProds(dataFromProtheus)
            setprotDataToTable(prodsArr)

            //data from farmbox
            const prodFarmArr = dataFromFarm(dataFromFam)
            let constArr = prodsArr

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
                const prodFromFarmAdjust = includeOthersFromFarm.map((data) => {
                    return ({
                        descricao_produto: data.name,
                        quantity_farmbox: data.quantity,
                        id_farm_box: data.input_id
                    })
                })
                const finalArrayOfProds = [...mergeProducts.sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto)), ...prodFromFarmAdjust.sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto))]

                setprotDataToTable(finalArrayOfProds)
                constArr = finalArrayOfProds

            }
            if(dataFromDjango.length > 0){
                console.log('finalArr: ', constArr)
                const djangoData = dataFromDjangoArr(dataFromDjango)
                console.log('data From Django: ', djangoData)

                const mergeDjangoProd = constArr.map((prods) => {
                    const findInFarmArray = djangoData.find((farm) => farm.id_farm_box === Number(prods.id_farm_box))
                    let objToAdd = {}
                    if (findInFarmArray) {
                        objToAdd = {
                            quantity_planted_django: findInFarmArray.quantity_planted_django
                        }
                    } else {
                        objToAdd = {
                            quantity_planted_django: 0
                        }
                    }
                    return ({
                        ...prods, ...objToAdd
                    })
                })
                const indsInMergedProdsDjango = mergeDjangoProd.map((data) => Number(data.id_farm_box))
                const includeOthersFromDjango = djangoData.filter((e) => !indsInMergedProdsDjango.includes(e.id_farm_box))
                const prodFromFarmAdjust = includeOthersFromDjango.map((data) => {
                    return ({
                        descricao_produto: data.produto,
                        quantity_planted_django: data["quantidade aplicar"],
                        id_farm_box: data.id_farm_box
                    })
                })

                const finalDjangoMergArr = [...mergeDjangoProd, ...prodFromFarmAdjust.sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto))]
                setprotDataToTable(finalDjangoMergArr)
            }


        }
    }, [dataFromFam, dataFromProtheus, dataFromDjango]);

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

    if (loadingData || loadingDataProtheus || loadingDataDjango) {
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
                backgroundColor: useThemeHere !== 'dark' ? "whitesmoke": colors.primary[500],
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
                <TableBio data={protDataToTable}/>
            </Box>
        </Box>
    );
}

export default InsumosBioPage;