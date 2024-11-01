import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

import { useEffect,useState } from 'react';

// Styled TableRow to remove default blue hover and make it black/white
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.2) !important', // White background on hover
        color: '#000000', // Black text on hover
    },
}));

const CompactTable = ({ data }) => {
    const [formatAps, setFormatAps] = useState([]);

    useEffect(() => {
        const getaps = data.aps.split(';')
        const newAps = getaps.map((data) => data.split('|')[0] + ' | ')
        setFormatAps(newAps)
    }, []);

    const formatNumber = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }


    return (
        <TableContainer component={Paper} style={{ marginTop: '20px', padding: '20px' }}>
            <Typography variant="h6" component="div" gutterBottom fontWeight={'bold'}>
                Nº {parseInt(data.cod_pre_st)}
            </Typography>
            <Table size="small" aria-label="compact table">
                <TableHead>
                    <StyledTableRow>
                        <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>Informações Gerais</TableCell>
                        <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>Destino</TableCell>
                        <TableCell colSpan={3} style={{ fontWeight: 'bold' }}>Produtos</TableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {/* Project Information */}
                    <StyledTableRow>

                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Fazenda</Typography>
                            {data.projetos}
                        </TableCell>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Filial</Typography>
                            {data.filial_destino}
                        </TableCell>
                        <TableCell colSpan={3} rowSpan={5} style={{ verticalAlign: 'top' }}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Lista de Produtos</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow fontWeight={'bold'}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Insumo</TableCell>
                                        <TableCell align="right">Quantidade em Aberto</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.produtos.map((product) => (
                                        <TableRow key={product.id_produto}>
                                            <TableCell>{product.id_produto}</TableCell>
                                            <TableCell>{product.produto}</TableCell>
                                            <TableCell align="right">{formatNumber(product.quantidade_saldo)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableCell>
                    </StyledTableRow>

                    {/* Date and APS */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Data Integração:</Typography>
                            {data.dt_integracao}
                        </TableCell>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Armazém Destino:</Typography>
                            {data.armazem_destino}
                        </TableCell>
                    </StyledTableRow>

                    {/* APS Information */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>APS:</Typography>
                            {formatAps}
                        </TableCell>
                    </StyledTableRow>

                    {/* Status */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Status:</Typography>
                            {data.status}
                        </TableCell>
                    </StyledTableRow>

                    {/* Observations */}
                    <StyledTableRow>
                        <TableCell colSpan={4} style={{ whiteSpace: 'pre-line' }}>
                            <Typography variant="subtitle2" fontWeight={'bold'}>Observações:</Typography>
                            {data.obs}
                        </TableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};


export default CompactTable;