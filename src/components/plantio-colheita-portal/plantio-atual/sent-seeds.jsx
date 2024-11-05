import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material'
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

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import cotton from '../../../utils/assets/icons/cotton.png'
import question from '../../../utils/assets/icons/question.png'

const DashboardTable = ({ data, isLoading, dataToReport }) => {

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

    const iconDict = [
        { cultura: "Feijão", icon: beans, alt: "feijao" },
        { cultura: "FEIJAO MUNGO", icon: beans, alt: "feijao" },
        { cultura: "Arroz", icon: rice, alt: "arroz" },
        { cultura: "Soja", icon: soy, alt: "soja" },
        { cultura: "Algodão", icon: cotton, alt: "algodao" },
    ];

    const filteredIcon = (data) => {
        const filtered = iconDict.filter(
            (dictD) => dictD.cultura === data
        );

        if (filtered.length > 0) {
            return filtered[0].icon;
        }
        return question;
    };

    const filteredAlt = (data) => {
        const filtered = iconDict.filter(
            (dictD) => dictD.cultura === data
        );

        if (filtered.length > 0) {
            return filtered[0].alt;
        }
        return question;
    };


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
                                <TableCell sx={{ fontWeight: 'bold' }}>Semente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Cultura</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Peso Total (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Estoque (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Utilizado (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Área Plantada (ha)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Semente/Ha (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"><span style={{ paddingRight: `${paddingSize}px` }}>Última Regulagem</span></TableCell>
                            </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {filteredRows.map((row, index) => {
                                console.log('rows here: ',row)
                                return (
                                <TableRow key={index}
                                    className={`${index % 2 !== 0 && styles.oddRow}`}
                                    sx={{
                                        backgroundColor: (index % 2 !== 0 && !isDark) && 'rgba(224,224,224,1) !important',
                                        '& .MuiTableCell-body': {
                                            paddingRight: `${paddingSize}px !important`,
                                            paddingLeft: `${paddingSize}px !important`,
                                            borderBottom: '0px !important'
                                        },
                                        "&:hover": {
                                            backgroundColor: colors.blueAccent[900]
                                        }
                                        // '& .MuiTableCell-body:hover': {
                                        //     backgroundColor: 'red'
                                        // },
                                    }}
                                >
                                    <TableCell><span style={{ paddingLeft: '5px' }}>{row.Destino.replace('Fazenda ', '')}</span></TableCell>
                                    <TableCell>{row.Produto}</TableCell>
                                    <TableCell>
                                    <div
                                    style={{textAlign: 'center'}}
                                    >
                                        <img
                                            src={filteredIcon(
                                                row.Cultura
                                            )}
                                            alt={filteredAlt(
                                                row.Cultura
                                            )}
                                            style={{
                                                filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
                                                width: '15px',
                                                height: '15px',
                                            }}
                                            />
                                            </div>
                                    </TableCell>

                                    <TableCell align="right">{formatNumberWei(row.Peso_Total)}</TableCell>
                                    <TableCell align="right">{row.Estoque ? formatNumberWei(row.Estoque) : " - "}</TableCell>
                                    <TableCell align="right">{row.Utilizado ? formatNumberWei(row.Utilizado) : ' - '}</TableCell>
                                    <TableCell align="right">{row.Area_Plantada ? formatNumber(row.Area_Plantada) : ' - '}</TableCell>
                                    <TableCell align="right">{row.Semente_Ha ? formatNumber(row.Semente_Ha) : ' - '}</TableCell>
                                    <TableCell align="right" sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', flexDirection: 'row', margin: '0 auto', marginRight: '10px', }}><span style={{ paddingRight: '12px' }}>{row.Ultima_Regulagem ? formatNumberRegulagem(row.Ultima_Regulagem) : ' - '}</span><span style={{ width: '70px', marginRight: `${paddingSize}px` }}>{row.Ultima_Regulagem ? formatQuantRegu(row.Ultima_Regulagem) : ' - '}</span></TableCell>
                                </TableRow>
                                )}
                            )}
                            {/* Totals Row */}
                            <TableRow sx={{
                                backgroundColor: 'rgba(224,224,224,0.5)', fontWeight: 'bold', '& .MuiTableCell-body': {
                                    paddingRight: `${paddingSize}px !important`,
                                    paddingLeft: `${paddingSize}px !important`
                                },
                                "&:hover": {
                                            backgroundColor: colors.blueAccent[900]
                                        }
                            }}>
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
                <Box justifySelf="end" sx={{marginTop: '5px'}}>
                    <Typography color={colors.primary[300]} fontSize={'10px'}>{dataToReport}</Typography>   
                </Box>
            </CardContent>
        </Card>
    );
};

export default DashboardTable;