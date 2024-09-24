import React from 'react';
import { useTheme, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

import { useEffect, useState } from 'react';
import { tokens } from '../../../../theme';
import styles from './table-show.module.css'


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#ffffff', // White background on hover
        color: '#000000', // Black text on hover,
    },
}));

const TableShow = ({ dataArr }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const [formatAps, setFormatAps] = useState([]);

    // useEffect(() => {
    //     const getaps = data.aps.split(';')
    //     const newAps = getaps.map((data) => data.split('|')[0] + ' | ')
    //     setFormatAps(newAps)
    // }, []);

    const formatNumber = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }
    function formatBrazilianDate(dateStr) {
        // Extract year, month, and day from the input string
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
    
        // Return the formatted date in 'dd/mm/yyyy' format
        return `${day}/${month}/${year}`;
    }
    

    return (
        <TableContainer component={Paper} style={{ padding: '20px' }}>
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell align="center">Nº</TableCell>
                        <TableCell align="center">Data</TableCell>
                        <TableCell align="center">Projeto</TableCell>
                        <TableCell align="center">Aps</TableCell>
                        <TableCell align="left">Produtos</TableCell>
                        <TableCell align="right" sx={{paddingRight: '5px !important'}}>Saldo</TableCell>
                    </TableRow>
                </TableHead>
                {
                    dataArr?.map((data, i) => {
                        const isOdd = i % 2
                        return (
                            <TableBody key={i}
                                className={isOdd ? styles.oddRow : styles.evenRow}
                            >
                                {data?.produtos?.filter((saldo) => saldo.quantidade_saldo > 0).map((prods, i) => {
                                    const totalProds = data.produtos.filter((saldo) => saldo.quantidade_saldo > 0).length
                                    const getaps = data.aps.split(';')
                                    let newAps;
                                    if (getaps.length > 1) {
                                        newAps = getaps.map((data) => data.split('|')[0]).join('|')
                                    } else {
                                        newAps = getaps.map((data) => data.split('|')[0])
                                    }
                                    return (
                                        <StyledTableRow key={i}>

                                            {/* Nº, Projeto, and Aps' only appear in the first row */}
                                            {i === 0 && (
                                                <>
                                                    <TableCell rowSpan={totalProds} align="center" sx={{ fontWeight: 'bold' }}>
                                                        {parseInt(data.cod_pre_st)}
                                                    </TableCell>
                                                    <TableCell rowSpan={totalProds} align="center">
                                                        {formatBrazilianDate(data.dt_integracao)}
                                                    </TableCell>
                                                    <TableCell rowSpan={totalProds} align="center">
                                                        {data.projetos}
                                                    </TableCell>
                                                    <TableCell rowSpan={totalProds} align="center">
                                                        {newAps}
                                                    </TableCell>
                                                </>
                                            )}
                                            <TableCell align="left" className={ (i !== totalProds - 1) ? styles.prodsLine : ''}>
                                                {prods.produto}
                                            </TableCell>
                                            <TableCell align="right" className={ (i !== totalProds - 1) ? styles.prodsLine : ''} sx={{paddingRight: '5px !important'}}>
                                                {formatNumber(prods.quantidade_saldo)}
                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        )
                    })


                }
            </Table>
        </TableContainer>
    );
};


export default TableShow;

