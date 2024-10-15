import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Paper,
    TextField,
    useTheme
} from '@mui/material';

import { tokens } from '../../../theme';

import styles from './sent-seeds.module.css'

const DashboardTable = ({ data, isLoading }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isDark = theme.palette.mode === 'dark'
    const [initialRows, setInitialRows] = useState([]);
    const [rows, setRows] = useState(data);
    const [filteredRows, setFilteredRows] = useState(initialRows);
    const [searchText, setSearchText] = useState('');
    const [totalsArr, setTotalsArr] = useState({});

    useEffect(() => {
        setInitialRows(data)
    }, [data]);

    useEffect(() => {
        setInitialRows(data)
    }, []);

    useEffect(() => {
        setFilteredRows(initialRows)
    }, [initialRows]);

    // Handle filtering
    useEffect(() => {
        const filtered = initialRows.filter(row =>
            row.Destino.toLowerCase().includes(searchText.toLowerCase()) ||
            row.Produto.toLowerCase().includes(searchText.toLowerCase()) ||
            row.Cultura.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredRows(filtered);
    }, [searchText]);

    useEffect(() => {


        // Calculate totals
        const calculateTotals = (rows) => {
            return {
                Destino: 'Totais',
                Produto: '',
                Cultura: '',
                Peso_Total: rows.reduce((sum, row) => sum + row.Peso_Total, 0),
                Estoque: rows.reduce((sum, row) => sum + row.Estoque, 0),
                Utilizado: rows.reduce((sum, row) => sum + row.Utilizado, 0),
                Area_Plantada: rows.reduce((sum, row) => sum + row.Area_Plantada, 0),
                Semente_Ha: rows.reduce((sum, row) => sum + row.Semente_Ha, 0),
                Ultima_Regulagem: ''
            };
        };
        const totalsRow = calculateTotals(filteredRows);
        setTotalsArr(totalsRow)
    }, [filteredRows]);

    const formatNumberRegulagem = (data) => {
        const dataReg = data.split("-")[0]
        if (data) {
            return (dataReg)
        }
    }

    const formatQuantRegu = (data) => {
        const quantiReg = data.split("-")[1]
        if (data) {
            return (quantiReg)
        }
    }

    const formatNumber = (data) => {
        if (data) {

            return data.toLocaleString(
                "pt-br",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        }
    }
    const formatNumberWei = (data) => {
        if (data) {
            return data.toLocaleString(
                "pt-br",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            )
        }
    }

    if (isLoading) {
        return <Typography>isLoading....</Typography>
    }

    const paddingSize = 5

    return (
        <Card sx={{ marginTop: 2, padding: 2, width: '1200px' }} elevation={8}>
            <CardContent>
                {/* Filter input */}
                <TextField
                    label="Filtrar"
                    variant="outlined"
                    size='small'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />

                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Sementes
                </Typography>

                {/* Table */}
                <TableContainer component={Paper} elevation={8}>
                    <Table>
                        {/* Table Head */}
                        <TableHead >
                            <TableRow
                                sx={{
                                    backgroundColor: colors.blueOrigin[500],
                                    '& .MuiTableCell-head': {
                                        paddingRight: `${paddingSize}px !important`,
                                        paddingLeft: `${paddingSize}px !important`
                                    }
                                }}
                            >
                                <TableCell sx={{ fontWeight: 'bold' }}><span style={{ paddingLeft: '5px' }}>Destino</span></TableCell>
<<<<<<< HEAD
                                <TableCell sx={{ fontWeight: 'bold', paddingLeft: '5px !important' }}>Semente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', paddingLeft: '5px !important' }}>Cultura</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', paddingRight: '5px !important' }} align="right">Peso Total (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', paddingRight: '5px !important' }} align="right">Estoque (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', paddingRight: '5px !important' }} align="right">Utilizado (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', paddingRight: '5px !important' }} align="right">Área Plantada (ha)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', paddingRight: '5px !important' }} align="right">Semente/Ha (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"><span style={{ paddingRight: '10px' }}>Última Regulagem</span></TableCell>
=======
                                <TableCell sx={{ fontWeight: 'bold' }}>Semente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Cultura</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Peso Total (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Estoque (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Utilizado (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Área Plantada (ha)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Semente/Ha (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"><span style={{ paddingRight: `${paddingSize}px` }}>Última Regulagem</span></TableCell>
>>>>>>> ef13e917ead0e8f597c15b42d4d3f5a761e2f672
                            </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {filteredRows.map((row, index) => (
                                <TableRow key={index}
                                    className={`${index % 2 !== 0 && styles.oddRow}`}
                                    sx={{
                                        backgroundColor: (index % 2 !== 0 && !isDark) && 'rgba(224,224,224,1) !important',
<<<<<<< HEAD
=======
                                        '& .MuiTableCell-body': {
                                            paddingRight: `${paddingSize}px !important`,
                                            paddingLeft: `${paddingSize}px !important`
                                        }
>>>>>>> ef13e917ead0e8f597c15b42d4d3f5a761e2f672
                                    }}

                                // className={`${index % 2 !== 0 && styles.oddRow} ${theme.palette.mode === "light" &&
                                //     index % 2 !== 0 &&
                                //     styles.oddRowLight
                                //     } ${theme.palette.mode === "light" &&
                                //         index % 2 === 0 &&
                                //         styles.evenRowLight
                                //         }`}

                                >
                                    <TableCell><span style={{ paddingLeft: '5px' }}>{row.Destino.replace('Fazenda ', '')}</span></TableCell>
                                    <TableCell>{row.Produto}</TableCell>
                                    <TableCell>{row.Cultura}</TableCell>

                                    <TableCell align="right">{formatNumberWei(row.Peso_Total)}</TableCell>
                                    <TableCell align="right">{row.Estoque ? formatNumberWei(row.Estoque) : " - "}</TableCell>
                                    <TableCell align="right">{row.Utilizado ? formatNumberWei(row.Utilizado) : ' - '}</TableCell>
                                    <TableCell align="right">{row.Area_Plantada ? formatNumber(row.Area_Plantada) : ' - '}</TableCell>
                                    <TableCell align="right">{row.Semente_Ha ? formatNumber(row.Semente_Ha) : ' - '}</TableCell>
<<<<<<< HEAD
                                    <TableCell align="right" sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', flexDirection: 'row', margin: '0 auto', marginRight: '10px', }}><span style={{ paddingRight: '12px' }}>{row.Ultima_Regulagem ? formatNumberRegulagem(row.Ultima_Regulagem) : ' - '}</span><span style={{ width: '70px', marginRight: '10px' }}>{row.Ultima_Regulagem ? formatQuantRegu(row.Ultima_Regulagem) : ' - '}</span></TableCell>

=======
                                    <TableCell align="right" sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', flexDirection: 'row', margin: '0 auto', marginRight: '10px', }}><span style={{ paddingRight: '12px' }}>{row.Ultima_Regulagem ? formatNumberRegulagem(row.Ultima_Regulagem) : ' - '}</span><span style={{ width: '70px', marginRight: `${paddingSize}px` }}>{row.Ultima_Regulagem ? formatQuantRegu(row.Ultima_Regulagem) : ' - '}</span></TableCell>
>>>>>>> ef13e917ead0e8f597c15b42d4d3f5a761e2f672
                                </TableRow>
                            ))}

                            {/* Totals Row */}
<<<<<<< HEAD
                            <TableRow sx={{ backgroundColor: isDark ? 'rgba(224,224,224,0.2)' : 'rgba(224,224,224,0.5)', fontWeight: 'bold' }}>
=======
                            <TableRow sx={{
                                backgroundColor: 'rgba(224,224,224,0.5)', fontWeight: 'bold', '& .MuiTableCell-body': {
                                    paddingRight: `${paddingSize}px !important`,
                                    paddingLeft: `${paddingSize}px !important`
                                }
                            }}>
>>>>>>> ef13e917ead0e8f597c15b42d4d3f5a761e2f672
                                <TableCell sx={{ fontWeight: 'bold' }}><span style={{ paddingLeft: '5px' }}>{totalsArr?.Destino}</span></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{totalsArr?.Produto}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{totalsArr?.Cultura}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">{formatNumberWei(totalsArr?.Peso_Total)}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">{formatNumberWei(totalsArr?.Estoque)}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">{formatNumberWei(totalsArr?.Utilizado)}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">{formatNumber(totalsArr?.Area_Plantada)}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default DashboardTable;