import { Box, Typography } from '@mui/material'
import { useTheme } from '@emotion/react';
import { tokens } from '../../../../theme';

import { useEffect, useState } from 'react';

const ListProducts = (props) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [filteredDataList, setFilteredDataList] = useState([]);
    const [totalValueProds, setTotalValueProds] = useState(0);
    const { selectedData, productsArr } = props
    const { Data, Projeto, Ap, Tipo } = selectedData

    const formatNumber = number => {
        return number?.toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    useEffect(() => {
        if (Object.keys(selectedData).length > 0) {
            const newData = productsArr.filter((item) => {
                const dateFilter = Data?.length === 0 || Data?.includes(item.date)
                const projetoFilter = Projeto?.length === 0 || Projeto?.includes(item.farmName)
                const apFilter = Ap?.length === 0 || Ap?.includes(item.finalCode)
                const tipoFilter = Tipo?.length === 0 || !Tipo?.includes(item.inputType)
                return dateFilter && projetoFilter && apFilter && tipoFilter
            })
            console.log('newData: ', newData)
            const newProds = newData.reduce((acc, curr) => { 
                if(acc.filter((input) => input.insumo === curr.inputName).length === 0) {
                    const objToAdd = {
                        insumo: curr.inputName,
                        quantidade: curr.quantity
                    }
                    acc.push(objToAdd)
                }  else {
                    const findIndexOf = (e) =>
                        e.insumo === curr.inputName
                    const getIndex = acc.findIndex(findIndexOf);
                    acc[getIndex]["quantidade"] += curr.quantity
                } 
                return acc
            }, [])


            const sortedProds = newProds.sort((a, b) => a.insumo.localeCompare(b.insumo))
            setFilteredDataList(sortedProds)  
            const setTotalValue = newProds.reduce((acc, curr) => acc += curr.quantidade, 0)
            setTotalValueProds(setTotalValue)
        } else {
            setFilteredDataList([])
            setTotalValueProds(0)
        }
    }, [selectedData]);

    // useEffect(() => {
    //     filteredDataList.forEach((data) =>{
    //         console.log('filteredDataList:', data)
    //     })
    // }, [filteredDataList]);


    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '20% 20% 40%',
                marginTop: '10px',
                paddingLeft: '20px',
                marginBottom: '20px',
                paddingBottom: '20px',
                columnGap: '5px'
            }}
        >
            <Box>
                <Typography sx={{ textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid white` }}>Projetos</Typography>
                {
                    Projeto && Projeto.length > 0 && Projeto.map((projetos, index) => {
                        return (
                            <Box key={index}>{projetos.replace('Fazenda ', '')}</Box>
                        )
                    })
                }
            </Box>
            <Box>
                <Typography sx={{ textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid white` }}>Ap's</Typography>
                {
                    Ap && Ap.length > 0 && Ap.map((aps, ind) => {
                        return (
                            <Box key={ind}>{aps}</Box>
                        )
                    })
                }
            </Box>

            <Box
                sx={{
                    // border: `1px solid ${colors.primary[200]}`
                }}
            >
                <Typography sx={{ textAlign: 'center', fontWeight: 'bold', borderBottom: `1px solid white` }}>Insumos</Typography>
                {
                    filteredDataList && filteredDataList.length > 0 &&
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '70% auto'
                    }}>
                        <Box>
                            {
                                filteredDataList.map((inputs, i) => {
                                    return (
                                        <Typography key={i}>{inputs.insumo}</Typography>
                                    )
                                })
                            }
                            <Box
                                sx={{
                                    borderTop: '1px solid white',
                                    marginTop: '5px',
                                }}
                            >
                                Total:
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            {
                                filteredDataList.map((inputs, i) => {
                                    return (
                                        <Typography key={i}>{formatNumber(inputs.quantidade)}</Typography>
                                    )
                                })
                            }

                            <Box
                                sx={{
                                    borderTop: '1px solid white',
                                    marginTop: '5px',
                                }}
                            >
                                {formatNumber(totalValueProds)}
                            </Box>

                        </Box>
                    </Box>
                }
            </Box>
        </Box>
    );
}

export default ListProducts;