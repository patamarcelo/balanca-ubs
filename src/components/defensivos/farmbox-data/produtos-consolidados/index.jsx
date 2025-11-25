import { Box, Button, Typography, IconButton, useTheme, Divider, Paper, Fab } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import SelectInputs from './select-inputs';
import DateTimeSelector from './date-time-select';

import { tokens } from '../../../../theme';

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectApp } from '../../../../store/plantio/plantio.selector';

import { generalDataArr, generalProjecs, generalTypesProds, generalProds, generalAppsGeneral, getInsumosList, farmDictCOde, armazemDictCode } from './helper';

import ListProducts from './list-products';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import toast from "react-hot-toast";
import { selectIsAdminUser } from '../../../../store/user/user.selector';

import djangoApi from '../../../../utils/axios/axios.utils';

import Swal from "sweetalert2";
import OpenApsAllprodsPage from './list-prods-open-apss-all';

import html2canvas from "html2canvas";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";





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
    const [filteredData, setFilteredData] = useState([]);


    const [isLoadingBtn, setIsLoadingBtn] = useState(false);

    const captureRef = useRef(null);


    // useEffect(() => {
    //     console.log('selectedData', selectedData);
    // }, [selectedData]);


    const handleClear = () => {
        console.log('clear')
        setSelectedData({})
        setStOpened(null)
        setObservations("")
        setFilteredData([])
    }

    const handleCapture = async () => {
        const element = captureRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                useCORS: true, // ajuda quando há imagens com CORS permitido
                scale: 2,      // aumenta resolução
            });

            const dataUrl = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `pre_st_${stOpened?.toString().trim() || 'gerada'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(
                `Captura de tela gerada`,
                {
                    position: "top-center",
                    duration: 5000
                }
            )
        } catch (err) {
            console.error("Erro ao gerar imagem:", err);
            alert("Não foi possível gerar a imagem.");
        }
    };

    useEffect(() => {
        if (openApp.length > 0) {

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
            produtos: prodcutsToProtheus?.filter((prod) => prod.inputType !== "Operação"),
            fazendaDestino: getCode,
            armazemDestino: getArmazenCode,
            observacao: observations,
            produtosGeral: filteredData
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
                        if (sent_by_email === 'Não') {
                            console.log('Problema em abrir a ST', st_number)
                            setStOpened(st_number)
                            Swal.fire({
                                title: "Problema!!",
                                html: `<b>Problema em Abrir a ST, e-mail não enviado!!`,
                                icon: "error"
                            });
                        } else {
                            console.log('tudo certo', st_number)
                            setStOpened(st_number)
                            Swal.fire({
                                title: "Feito!!",
                                html: `<b>ST Aberta com Suscesso: ${st_number}</b> <br> Enviada por E-mail: ${sent_by_email}`,
                                icon: "success"
                            });
                        }

                        // 🚀 espera 2s pra garantir que o número já foi renderizado
                        setTimeout(async () => {
                            try {
                                await handleCapture();
                                toast.success(
                                    `Captura de tela gerada`,
                                    {
                                        position: "top-center",
                                        duration: 5000
                                    }
                                )

                            } catch (e) {
                                console.error("Erro ao capturar a tela após abrir ST:", e);
                            }
                        }, 2000);

                    } else if (res.status === 208) {
                        const { msg, error } = res.data
                        Swal.fire({
                            title: `${msg}`,
                            text: `${error}!!`,
                            icon: "error",
                            showCloseButton: true,
                        });
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
        <Box
            width={"100%"}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 200px) 100px 20px',
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

                        <Box
                            sx={{
                                justifySelf: 'center',
                            }}
                        >
                            <LoadingButton
                                variant="contained"
                                color="success"
                                onClick={handlerStProtheus}
                                disabled={stOpened && stOpened !== 0}
                                loading={isLoadingBtn}
                            >Gerar St</LoadingButton>
                        </Box>
                        <Fab
                            color="success"
                            onClick={handleCapture}
                            aria-label="Capturar imagem"
                            sx={{
                                position: "fixed",
                                bottom: 24,
                                right: 28,
                                boxShadow: 4,
                            }}
                        >
                            <PhotoCameraIcon />
                        </Fab>
                        <Box
                            sx={{
                                justifySelf: 'center',
                            }}
                        >
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
                        ref={captureRef}
                        sx={{
                            display: 'inline-block',
                            paddingRight: '20px'
                        }}
                    >
                        <Box
                            component={stOpened && Paper}
                            elevation={stOpened && 8}
                            sx={{
                                paddingLeft: '20px',
                                marginTop: '5px',
                                marginRight: '-10px',
                                paddingTop: 1
                            }}
                        >
                            <Typography sx={{ fontSize: '12px' }} color={colors.textColor[100]}>{showDateTime}</Typography>
                            {
                                stOpened && stOpened !== 0 &&
                                <Typography sx={{ marginLeft: '-20px', fontWeight: '600', fontSize: '16px', marginTop: '0px', backgroundColor: 'blue', padding: '0px 40px 0px 20px', }} color={colors.textColor[200]}>Pré ST:
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px', marginLeft: '10px', }} color={colors.textColor[100]}>{stOpened}</span>
                                </Typography>
                            }
                            {stOpened && stOpened === 0 &&
                                <Typography sx={{ marginLeft: '-30px', fontWeight: '600', fontSize: '16px', marginTop: '0px', backgroundColor: 'red', padding: '0px 40px 0px 30px', }} color={colors.textColor[200]}>Erro ao abrir Pré ST
                                </Typography>

                            }
                        </Box>
                        <ListProducts selectedData={selectedData} productsArr={productsArr} setprodcutsToProtheus={setprodcutsToProtheus} setObservations={setObservations} observations={observations} />
                    </Box>
                    {
                        selectedData &&
                        <>
                            <Divider />
                            <Box
                                sx={{
                                    paddingLeft: '20px',
                                    marginTop: '5px',
                                    marginRight: '-10px',
                                    marginBottom: '40px'
                                }}
                            >
                                <OpenApsAllprodsPage data={openApp} selectedData={selectedData} setFilteredData={setFilteredData} filteredData={filteredData} />
                            </Box>
                        </>
                    }
                </Box>
            }

        </Box>
    );
}

export default ProdutosConsolidados;