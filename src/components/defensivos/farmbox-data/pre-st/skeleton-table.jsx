import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Styled TableRow to remove default blue hover and set to white/black
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#ffffff', // White background on hover
        color: '#000000', // Black text on hover
    },
}));

const CompactTableSkeleton = () => {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 2, padding: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
                Project Information
            </Typography>
            <Table size="small" aria-label="compact table skeleton">
                <TableHead>
                    <StyledTableRow>
                        <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>General Info</TableCell>
                        <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                        <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Products</TableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {/* Skeleton Row for Project Info */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2">Project:</Typography>
                            {/* Placeholder for project data */}
                        </TableCell>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2">Destination Branch:</Typography>
                            {/* Placeholder for branch data */}
                        </TableCell>
                        <TableCell colSpan={3} rowSpan={5} sx={{ verticalAlign: 'top' }}>
                            <Typography variant="subtitle2">Product List:</Typography>
                            {/* Nested Table for products */}
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="right">Remaining Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Placeholder rows for product list */}
                                    <TableRow>
                                        <TableCell>Placeholder</TableCell>
                                        <TableCell>Placeholder</TableCell>
                                        <TableCell align="right">Placeholder</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableCell>
                    </StyledTableRow>

                    {/* Skeleton Row for Date and APS */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2">Integration Date:</Typography>
                            {/* Placeholder for integration date */}
                        </TableCell>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2">Warehouse Destination:</Typography>
                            {/* Placeholder for warehouse data */}
                        </TableCell>
                    </StyledTableRow>

                    {/* Skeleton Row for APS Information */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2">APS:</Typography>
                            {/* Placeholder for APS info */}
                        </TableCell>
                    </StyledTableRow>

                    {/* Skeleton Row for Status */}
                    <StyledTableRow>
                        <TableCell colSpan={2}>
                            <Typography variant="subtitle2">Status:</Typography>
                            {/* Placeholder for status */}
                        </TableCell>
                    </StyledTableRow>

                    {/* Skeleton Row for Observations */}
                    <StyledTableRow>
                        <TableCell colSpan={4} sx={{ whiteSpace: 'pre-line' }}>
                            <Typography variant="subtitle2">Notes:</Typography>
                            {/* Placeholder for observations */}
                        </TableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CompactTableSkeleton;