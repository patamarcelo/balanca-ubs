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
// import bioDjangoProje from './bio-django-proj.json'


import TableBio from "./table-bio";


import formatProds, { dataFromFarm, dataFromDjangoArr, dataFromDjangoProjetadoArr } from './support-bio.js'

import { selectSafraCiclo } from "../../../store/plantio/plantio.selector.js";

const InsumosBioPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const useThemeHere = theme.palette.mode
    const safraCiclo = useSelector(selectSafraCiclo);

    const user = useSelector(selectCurrentUser);

    const [loadingData, setLoadinData] = useState(true);
    const [dataFromFam, setDataFromFam] = useState([]);

    const [loadingDataProtheus, setloadingDataProtheus] = useState(true);
    const [dataFromProtheus, setdataFromProtheus] = useState([]);

    const [dataFromDjango, setDataFromDjango] = useState([]);
    const [loadingDataDjango, setloadingDataDjango] = useState(true);

    const [dataFromDjangoProjetado, setDataFromDjangoProjetado] = useState([]);
    const [isLoadingDjangoProjetado, setIsLoadingDjangoProjetado] = useState(true);

    // const [filteredProdcuts, setFilteredProdcuts] = useState([]);

    const [protDataToTable, setprotDataToTable] = useState([]);

    const futureDay = () => {
        const today = new Date()
        const futureDay = new Date()
        futureDay.setDate(today.getDate() + 15)
        return futureDay.toLocaleString("pt-BR").split(',')[0].split('/').reverse().join('-')
    }

    const futDate = futureDay()

    const [params, setParams] = useState({
		safra: safraCiclo.safra,
		ciclo: safraCiclo.ciclo,
	});


	useEffect(() => {
		setParams({
			safra: safraCiclo.safra,
			ciclo: safraCiclo.ciclo,
		});
	}, [safraCiclo]);


    
    
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

    useEffect(() => {
        const getTrueApi = async () => {
            try {
                await djangoApi
                    .post("plantio/get_plantio_operacoes_detail/", safraCiclo, {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        }
                    })
                    .then((res) => {
                        // console.log(res.data);
                        setDataFromDjangoProjetado(res.data);
                    })
                    .catch((err) => console.log(err));

                    setIsLoadingDjangoProjetado(false)
            } catch (err) {
                console.log("Erro ao consumir a API", err);
                setIsLoadingDjangoProjetado(false)
            } finally {
                setIsLoadingDjangoProjetado(false)
                // console.log("Finally statement");
            }
        };
        getTrueApi()
    }, [safraCiclo]);


    // useEffect(() => {
    //     setDataFromFam(biofarm)
    //     setdataFromProtheus(bioprot.itens)
    //     setDataFromDjango(biodjango.data)
    //     setDataFromDjangoProjetado(bioDjangoProje)

    //     setloadingDataDjango(false)
    //     setLoadinData(false);
    //     setloadingDataProtheus(false)
    //     setIsLoadingDjangoProjetado(false)
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
                const djangoData = dataFromDjangoArr(dataFromDjango)
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
                        descricao_produto: data.descricao_produto,
                        quantity_planted_django: data.quantity_planted_django,
                        id_farm_box: data.id_farm_box,
                        quantity_farmbox: 0
                    })
                })

                const finalDjangoMergArr = [...mergeDjangoProd, ...prodFromFarmAdjust.sort((a, b) => a.descricao_produto.localeCompare(b.descricao_produto))]
                setprotDataToTable(finalDjangoMergArr)
                constArr = finalDjangoMergArr
            }
            if(dataFromDjangoProjetado?.app_date?.length > 0) {
                const djangoProjet = dataFromDjangoProjetadoArr(dataFromDjangoProjetado, futDate)
                const mergeDjangoProdProjetado = constArr.map((prods) => {
                    const findInFarmArray = djangoProjet.find((farm) => farm.id_farmbox === Number(prods.id_farm_box))
                    let objToAdd = {}
                    if (findInFarmArray) {
                        objToAdd = {
                            quantity_projeted_django: findInFarmArray.quantidade
                        }
                    } else {
                        objToAdd = {
                            quantity_projeted_django: 0
                        }
                    }
                    return ({
                        ...prods, ...objToAdd
                    })
                })
                const indsInMergedProdsDjangoPlaned = mergeDjangoProdProjetado.map((data) => Number(data.id_farm_box))
                const includeOthersFromDjangoPlaned = djangoProjet.filter((e) => !indsInMergedProdsDjangoPlaned.includes(e.id_farmbox))
                const prodFromFarmAdjust = includeOthersFromDjangoPlaned.map((data) => {
                    return ({
                        descricao_produto: data.produto,
                        quantity_projeted_django: data.quantidade,
                        id_farm_box: data.id_farmbox,
                        quantity_farmbox: 0,
                        quantity_planted_django: 0
                    })
                })
                const finalProjDajngo = [...mergeDjangoProdProjetado, ...prodFromFarmAdjust]
                setprotDataToTable(finalProjDajngo)
            }


        }
    }, [dataFromFam, dataFromProtheus, dataFromDjango, dataFromDjangoProjetado, futDate]);

    // useEffect(() => {
    //     if (dataFromProtheus.length > 0) {
    //         const filiais = [{ cod_filial: '0209', des_filial: 'UBS' }];
    //         const newArr = dataFromProtheus?.map((item) => {
    //             const newArr = item.filiais;
    //             let hasHere = false;
    //             let farmProd = {};
    //             let farmOrigName;
    //             newArr.forEach((filial) => {
    //                 if (filiais.filter((data) => data.cod_filial === filial.cod_filial).length === 0) {
    //                     const objToAdd = { cod_filial: filial.cod_filial, des_filial: filial.desc_filial }
    //                     filiais.push(objToAdd)
    //                 }
    //             });
    //             return { ...item, hasHere, ...farmProd, farmOrigName };
    //         });
    //         // console.log('Filiais: ', filiais)
    //         setFilteredProdcuts(newArr);
    //     }
    // }, [dataFromProtheus]);

    if (loadingData || loadingDataProtheus || loadingDataDjango || isLoadingDjangoProjetado) {
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