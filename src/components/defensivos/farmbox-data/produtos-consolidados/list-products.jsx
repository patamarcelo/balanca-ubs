import { Box, Typography } from '@mui/material'
import { useTheme } from '@emotion/react';
import { tokens } from '../../../../theme';

import { useEffect, useState } from 'react';

const ListProducts = (props) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const isDark = theme.palette.mode === 'dark'

    const [filteredDataList, setFilteredDataList] = useState([]);
    const [totalValueProds, setTotalValueProds] = useState(0);
    const [totalAreaAps, setTotalAreaAps] = useState(0);
    const { selectedData, productsArr } = props
    const { Data, Projeto, Ap, Tipo } = selectedData

    const formatNumber = number => {
        return number?.toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    const formatApName = (ap) => {
        return ap.split(' | ')[0]
    }

    useEffect(() => {
        if (selectedData?.Data?.length > 0 && selectedData?.Projeto?.length > 0 && selectedData?.Ap?.length > 0) {
            const newData = productsArr.filter((item) => {
                const dateFilter = Data?.length === 0 || Data?.includes(item.date)
                const projetoFilter = Projeto?.length === 0 || Projeto?.includes(item.farmName)
                const apFilter = Ap?.length === 0 || Ap?.map((data) => formatApName(data))?.includes(item.finalCode)
                const tipoFilter = Tipo?.length === 0 || !Tipo?.includes(item.inputType)
                return dateFilter && projetoFilter && apFilter && tipoFilter
            })
            console.log('newData: ', newData)
            const filtData = selectedData?.DateTime ? newData.filter((data) => data.inputLastUpdated > selectedData?.DateTime) : newData 
            const newProds = filtData.reduce((acc, curr) => {
                if (acc.filter((input) => input.insumo === curr.inputName).length === 0) {
                    const objToAdd = {
                        insumo: curr.inputName,
                        quantidade: curr.quantity
                    }
                    acc.push(objToAdd)
                } else {
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

    const borderColor = colors.textColor[100]

    
    const getAreaAp = (ap) => {
        const filteredArea = productsArr.filter((data) => data.finalCode === formatApName(ap)).filter((data) => data.inputType === 'Operação')[0]
        if(filteredArea){
            const { quantity } = filteredArea
            if(quantity){
                return formatNumber(quantity)
            }
        }
        return 0
    }

    useEffect(() => {
        if (Ap?.length > 0) {
            const filteredArea = productsArr.filter((data) => Ap?.map((data) => formatApName(data)).includes(data.finalCode)).filter((data) => data.inputType === 'Operação')
            const totalValue = filteredArea.reduce((acc, curr) => acc += curr.quantity, 0)
            setTotalAreaAps(totalValue)
        }
    }, [Ap, productsArr]);

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '150px 250px 300px',
                marginTop: '10px',
                paddingLeft: '20px',
                marginBottom: '20px',
                paddingBottom: '20px',
                columnGap: '25px'
            }}
        >
            <Box>
                <Typography sx={{ textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid ${borderColor}` }}>Projeto{Projeto?.length !== 1 && 's'}</Typography>
                {
                    Projeto && Projeto.length > 0 && Projeto.map((projetos, index) => {
                        return (
                            <Box key={index}>{projetos.replace('Fazenda ', '')}</Box>
                        )
                    })
                }
            </Box>
            <Box>
                <Typography sx={{ textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid ${borderColor}` }}>Ap's</Typography>
                {
                    Ap && Ap.length > 0 && Ap.sort((a,b) => a.localeCompare(b)).map((aps, ind) => {

                        return (
                            <Box key={ind}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    flexDirection: 'row',
                                    // paddingRight: '0px',
                                }}
                            ><span>{formatApName(aps)}</span><span>{getAreaAp(aps)}</span> </Box>
                        )
                    })
                }
                {
                    Ap && Ap.length > 1 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            flexDirection: 'row',
                            // paddingRight: '2px',
                            // marginTop: '10px',
                            borderTop: `1px dotted ${colors.textColor[100]}`
                        }}
                        >
                            <b>
                                <span> </span> </b><b><span>{formatNumber(totalAreaAps)}</span>
                            </b>
                        </Box>
                    )
                }
            </Box>

            <Box
                sx={{
                    // border: `1px solid ${colors.primary[200]}`
                }}
            >
                <Typography sx={{ textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid ${borderColor}` }}>Insumos</Typography>
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
                                        <Typography 
                                        sx={{borderBottom: `0.1px dotted ${borderColor}`}}
                                        key={i}>{inputs.insumo}</Typography>
                                    )
                                })
                            }
                            <Box
                                sx={{
                                    marginTop: '2px',
                                    fontWeight: 'bold',
                                }}
                            >
                                
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            {
                                filteredDataList.map((inputs, i) => {
                                    return (
                                        <Typography
                                        sx={{borderBottom: `0.1px dotted ${borderColor}`}}
                                        key={i}>{formatNumber(inputs.quantidade)}</Typography>
                                    )
                                })
                            }

                            <Box
                                sx={{
                                    marginTop: '2px',
                                    fontWeight: 'bold',
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