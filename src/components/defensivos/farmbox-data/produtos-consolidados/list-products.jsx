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
        const filteredArea = productsArr.filter((data) => data.finalCode === ap).filter((data) => data.inputType === 'Operação')[0]
        const { quantity } = filteredArea
        return formatNumber(quantity)
    }

    useEffect(() => {
        if (Ap?.length > 0) {
            const filteredArea = productsArr.filter((data) => Ap?.includes(data.finalCode)).filter((data) => data.inputType === 'Operação')
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
                columnGap: '5px'
            }}
        >
            <Box>
                <Typography sx={{ textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid ${borderColor}` }}>Projetos</Typography>
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
                    Ap && Ap.length > 0 && Ap.map((aps, ind) => {

                        return (
                            <Box key={ind}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    flexDirection: 'row',
                                    paddingRight: '10px',
                                }}
                            ><span>{aps}</span><span>{getAreaAp(aps)}</span> </Box>
                        )
                    })
                }
                {
                    Ap && Ap.length > 0 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            flexDirection: 'row',
                            paddingRight: '10px',
                            marginTop: '10px',
                            borderTop: `1px dotted ${colors.textColor[100]}`
                        }}
                    ><span>Total:</span><span>{formatNumber(totalAreaAps)}</span> </Box>
                    )
                }
            </Box>

            <Box
                sx={{
                    // border: `1px solid ${colors.primary[200]}`
                }}
            >
                <Typography sx={{ textAlign: 'center', fontWeight: 'bold', borderBottom: `1px solid ${borderColor}` }}>Insumos</Typography>
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
                                    borderTop: `1px dotted ${borderColor}`,
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
                                    borderTop: `1px dotted ${borderColor}`,
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