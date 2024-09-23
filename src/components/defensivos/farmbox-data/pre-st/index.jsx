
import { Box, Button, Typography, IconButton, useTheme } from '@mui/material'
import { tokens } from '../../../../theme';

// import CardTable from './card-to-show';
import CompactTable from './table-to-show';
import CompactTableSkeleton from './skeleton-table';


import { useEffect, useState } from 'react';
import { nodeServerSrd } from '../../../../utils/axios/axios.utils';



const PreStPage = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = theme.palette.mode === 'dark'

    const [loadingDataProtheus, setloadingDataProtheus] = useState(false);
    const [dataFromProtheus, setDataFromProtheus] = useState([]);

    const { closePage } = props;

    useEffect(() => {
        const handleSearch = async () => {
            setloadingDataProtheus(true);
            const paramsQuery = { products: 'bio' }
            try {
                nodeServerSrd
                    .get("/get-open-pre-st-srd", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
                        },
                        params: {
                            paramsQuery
                        }
                    })
                    .then(res => {
                        console.log(res?.data?.pre_sts)
                        setDataFromProtheus(res?.data?.pre_sts)
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
    }, []);

    const exampleData = {
        cod_pre_st: "000012",
        projetos: "Fazenda Cervo",
        dt_integracao: "20240911",
        aps: "Cervo - API109 | 2024-09-11",
        obs: "Foi enviado 140KG de Glifosato\nFoi enviado 4L de Legat Reduce \nFoi enviado 25L de Óleo Mineral\nNota dos produtos foi feita da forma antiga, abrindo diretamente a ST.",
        status: "2",
        filial_destino: "0202",
        armazem_destino: "01",
        produtos: [
            {
                id_produto: "154201",
                produto: "GLIFOSATO",
                quantidade_saldo: 137.7
            },
            {
                id_produto: "178653",
                produto: "LEGAT REDUCE",
                quantidade_saldo: 3.94
            },
            {
                id_produto: "154220",
                produto: "ÓLEO MINERAL",
                quantidade_saldo: 23.66
            }
        ]
    };


    return (
        <Box
            sx={{
                display: 'flex',
                // justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: !isDark && 'whitesmoke',
                borderRadius: '12px',
                minHeight: '500px'
            }}
            mt={4}
        >

            <Box
                p={2}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    backgroundColor: colors.blueOrigin[800],
                    borderRadius: '12px'
                }}
            >
                <Typography variant="h2" color={colors.textColor[100]}
                sx={{
                    margin: '0 auto',
                    top: '0'
                }}
                >Pré St</Typography>
                <Box
                    sx={{
                        top: '0'
                    }}
                >
                    <Button variant='outlined' color='error' onClick={() => closePage(false)}>X</Button>
                </Box>
            </Box>

            {/* <CardTable data={exampleData} /> */}
            {
                loadingDataProtheus &&
                <CompactTableSkeleton />
            }
            {
                !loadingDataProtheus && dataFromProtheus?.length > 0 &&
                dataFromProtheus.filter((data) => data.status === '1' || data.status === '2').map((data => {
                    return (
                        <CompactTable data={data} />
                    )
                }))

            }
        </Box>
    );
}

export default PreStPage;