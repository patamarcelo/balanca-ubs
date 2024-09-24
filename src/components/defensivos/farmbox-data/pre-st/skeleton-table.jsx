
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';

const SkeletonTable = () => {
    // Define the number of rows you want to display as skeletons
    const numberOfSkeletonRows = 20;

    return (
        <TableContainer component={Paper} style={{ marginTop: '20px', padding: '20px' }}>
            <Table>
                {/* Table Header */}
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Nº</TableCell>
                        <TableCell align="center">Data</TableCell>
                        <TableCell align="center">Projeto</TableCell>
                        <TableCell align="center">Aps'</TableCell>
                        <TableCell align="center">Produto </TableCell>
                        <TableCell align="center"> Saldo</TableCell>
                    </TableRow>
                </TableHead>

                {/* Table Body with Skeleton Loader */}
                <TableBody>
                    {[...Array(numberOfSkeletonRows)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">
                                <Skeleton variant="text" width={30} />
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton variant="text" width={80} />
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton variant="text" width={80} />
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton variant="text" width={80} />
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton variant="text" width={80} height={20} />
                            </TableCell>
                            <TableCell align="center">
                                <Skeleton variant="text" width={80} height={20} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SkeletonTable;