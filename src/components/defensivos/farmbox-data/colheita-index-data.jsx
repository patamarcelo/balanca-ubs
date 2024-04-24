import { Box, useTheme, Typography, Button } from '@mui/material'
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from '../../../theme';

import { nodeServer } from "../../../utils/axios/axios.utils";

import { useEffect, useState } from "react";

import { useSelector } from 'react-redux'
import { selectSafraCiclo } from "../../../store/plantio/plantio.selector"
import { selectCurrentUser } from "../../../store/user/user.selector"




const ColheitaPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const safraCiclo = useSelector(selectSafraCiclo);
    const user = useSelector(selectCurrentUser);

    const [isLoading, setIsLoading] = useState(false);
    const [dataColheita, setDataColheita] = useState([]);

    const getPlantioData = async () => {
        try {
            setIsLoading(true);
            console.log('pegando os dados')
            await nodeServer
                .get("/data-detail-plantio", {
                    headers: {
                        Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                        "X-Firebase-AppCheck": user.accessToken
                    },
                    params: {
                        safraCiclo
                    }
                })
                .then((res) => {
                    console.log(res.data)
                    setDataColheita(res.data)
                })
                .catch((err) => console.log(err));
        } catch (err) {
            console.log("Erro ao consumir a API", err);
        } finally {
            setIsLoading(false);
        }
    };
    const handleRefresh = () => {
        getPlantioData()
    }

    useEffect(() => {
        const getPlantioData = async () => {
            try {
                setIsLoading(true);
                await nodeServer
                    .get("/data-detail-plantio", {
                        headers: {
                            Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
                            "X-Firebase-AppCheck": user.accessToken
                        },
                        params: {
                            safraCiclo
                        }
                    })
                    .then((res) => {
                        console.log(res.data)
                    })
                    .catch((err) => console.log(err));
            } catch (err) {
                console.log("Erro ao consumir a API", err);
            } finally {
                setIsLoading(false);
            }
        };
        getPlantioData()
    }, []);


    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    width: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    flexGrow: 1,
                    // border: `1px solid ${colors.textColor[100]}`
                }}
            >
                <CircularProgress
                    size={40}
                    sx={{
                        margin: "-10px 10px",
                        color: (theme) =>
                            colors.greenAccent[
                            theme.palette.mode === "dark"
                                ? 200
                                : 800
                            ]
                    }}
                />
            </Box>
        )
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'baseline',
                width: '100%',
                height: '100%',
                // backgroundColor:  'red'
            }}
        >
            <Box
                p={2}
                width={"100%"}
                justifyContent={"flex-end"}
                textAlign={"right"}
            >
                <Button onClick={handleRefresh} variant='outlined' color='success'>Atualizar</Button>
            </Box>
            {
                dataColheita.length > 0 &&
                <Box

                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'baseline',
                        width: '100%',
                        height: '100%',
                    }}
                >

                    {
                        dataColheita.length > 0 &&
                        dataColheita.map((data, i) => {
                            return (
                                <Box key={i}
                                    display="flex"
                                    flexDirection="column"
                                    width="100%"
                                >
                                    <Box>
                                        <Typography color={colors.textColor[100]} variant='h4'>
                                            {data.code} -
                                        </Typography>
                                    </Box>
                                    <Box>

                                        <Typography color={colors.textColor[100]} variant='h4'>
                                            {data.plantations[0].plantation.farm_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            }
        </Box>
    );
}

export default ColheitaPage;