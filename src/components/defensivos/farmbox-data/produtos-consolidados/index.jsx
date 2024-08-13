import { Box, Button, Typography, IconButton, useTheme } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import SelectInputs from './select-inputs';
import DateTimeSelector from './date-time-select';

import { tokens } from '../../../../theme';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectApp } from '../../../../store/plantio/plantio.selector';

import { generalDataArr, generalProjecs, generalTypesProds, generalProds, generalAppsGeneral, getInsumosList, farmDictCOde, armazemDictCode } from './helper';

import ListProducts from './list-products';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import toast from "react-hot-toast";
import { selectIsAdminUser } from '../../../../store/user/user.selector';

import djangoApi from '../../../../utils/axios/axios.utils';


const ProdutosConsolidados = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isAdminUser = useSelector(selectIsAdminUser);

    const openApp = useSelector(selectApp);


    const [onlyDates, setOnlyDates] = useState([]);
    const [onlyProjetos, setOnlyProjetos] = useState([]);
    const [onlyTypes, setOnlyTypes] = useState([]);
    const [onlyProdutcts, setOnlyProdutcts] = useState([]);
    const [onlyApps, setOnlyApps] = useState([]);
    const [showDateTime, setShowDateTime] = useState(null);

    const [selectedData, setSelectedData] = useState({});
    const [observations, setObservations] = useState("");

    const [productsArr, setProductsArr] = useState([]);
    const [prodcutsToProtheus, setprodcutsToProtheus] = useState([]);

    const [stOpened, setStOpened] = useState(null);


    const [isLoadingBtn, setIsLoadingBtn] = useState(false);

    // useEffect(() => {
    //     console.log('selectedData', selectedData);
    // }, [selectedData]);


    const handleClear = () => {
        console.log('clear')
        setSelectedData({})
        setStOpened(null)
        setObservations("")
    }

    useEffect(() => {
        if (openApp.length > 0) {
            console.log('open app: ', openApp);

            const getDates = generalDataArr(openApp)
            const getProjetos = generalProjecs(openApp)
            const getTypes = generalTypesProds(openApp)
            const getProds = generalProds(openApp)
            const getApps = generalAppsGeneral(openApp)
            const getProducts = getInsumosList(openApp)


            if (getDates.length > 0) {
                setOnlyDates(getDates);
                setOnlyProjetos(getProjetos);
                setOnlyTypes(getTypes)
                setOnlyProdutcts(getProds)
                setOnlyApps(getApps)
                setProductsArr([])
                setProductsArr(getProducts)
            }
        }
    }, [openApp]);

    const handlerStProtheus = async () => {
        console.log('Enviar dados para o protheus')
        const getCode = farmDictCOde.find((data) => data.projeto === selectedData.Projeto[0]).code;
        const getArmazenCode = armazemDictCode.find((data) => data.projeto === selectedData.Projeto[0]).code;
        const dataToSend = {
            ...selectedData,
            produtos: prodcutsToProtheus,
            fazendaDestino: getCode,
            armazemDestino: getArmazenCode,
            observacao: observations
        }
        console.log('dados Selecionados: ', dataToSend)
        const params = JSON.stringify(dataToSend)
        try {
            setIsLoadingBtn(true)
            await djangoApi
                .post("opensts/open_st_by_protheus/", { dados_st: params }, {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                    }
                })
                .then((res) => {
                    console.log(res);
                    if (res.status === 201) {
                        const { st_number, sent_by_email } = res.data
                        console.log('tudo certo', st_number)
                        // setStOpened(st_number)
                        toast.success(`ST Aberta com Suscesso: ${st_number}\nEnviada por E-mail: ${sent_by_email}`, {
                            position: "top-center",
                            duration: 6000,
                        }
                        );
                    }
                });
        } catch (err) {
            console.log("Erro ao enviar os dados", err);

            toast.error(
                `Erro ao Enviar os dados - ${err}`,
                {
                    position: "top-center",
                    duration: 5000
                }
            )
            setIsLoadingBtn(false)
        } finally {
            console.log('finally alterar')
            setIsLoadingBtn(false)
        }
    }

    useEffect(() => {
        const getCurrentDateTime = () => {
            const now = new Date();
            const pad = (num) => num.toString().padStart(2, '0');
            const day = pad(now.getDate());
            const month = pad(now.getMonth() + 1); // Months are zero-based
            // const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
            const year = now.getFullYear().toString(); // Get last 2 digits of year
            const hours = pad(now.getHours());
            const minutes = pad(now.getMinutes());

            return `${day}/${month}/${year} - ${hours}:${minutes}`;
        };
        if (selectedData) {
            setShowDateTime(getCurrentDateTime());
        }
    }, [selectedData]);

    return (
        <Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 200px) 90px 10px',
                    columnGap: '20px',
                    alignItems: 'center',
                }}
            >
                <SelectInputs label="Projeto" inputsArr={onlyProjetos} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Data" inputsArr={onlyDates} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Ap" inputsArr={onlyApps} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Tipo" inputsArr={onlyTypes} setSelectedData={setSelectedData} selectedData={selectedData} />
                <SelectInputs label="Insumo" inputsArr={onlyProdutcts} setSelectedData={setSelectedData} selectedData={selectedData} />
                <DateTimeSelector label="DateTime" setSelectedData={setSelectedData} selectedData={selectedData} />
                {
                    Object.keys(selectedData).length > 0 && isAdminUser &&
                    <>

                        <Box>
                            <LoadingButton
                                variant="contained"
                                color="success"
                                onClick={handlerStProtheus}
                                disabled={false}
                                loading={isLoadingBtn}
                            >Gerar St</LoadingButton>
                        </Box>
                        <Box>
                            <IconButton aria-label="delete" onClick={handleClear} color="error">
                                <CancelPresentationIcon />
                            </IconButton>
                        </Box>
                    </>
                }
            </Box>
            {
                Object.keys(selectedData).length > 0 &&
                <Box>
                    <Box
                        sx={{
                            paddingLeft: '20px',
                            marginTop: '5px',
                        }}
                    >
                        <Typography sx={{ fontSize: '12px' }} color={colors.textColor[100]}>{showDateTime}</Typography>
                        {
                            stOpened &&
                            <Typography sx={{ marginLeft: '-30px', fontSize: '16px', marginTop: '0px', backgroundColor: 'blue', padding: '5px 40px 0px 30px',  }} color={colors.textColor[200]}>Solicitação: 
                                <span style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px', marginLeft: '10px', }} color={colors.textColor[100]}>{123}</span>
                            </Typography>
                        }
                    </Box>
                    <ListProducts selectedData={selectedData} productsArr={productsArr} setprodcutsToProtheus={setprodcutsToProtheus} setObservations={setObservations} observations={observations} />
                </Box>
            }

        </Box>
    );
}

export default ProdutosConsolidados;