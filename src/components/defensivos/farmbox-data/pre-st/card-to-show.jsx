import React from "react";
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
    Paper
} from "@mui/material";

const CardTable = ({ data }) => {
    return (
        <Card style={{ margin: "20px", padding: "20px" }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Project: {data.projetos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Date: {data.dt_integracao}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    APS: {data.aps}
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ whiteSpace: "pre-line" }}
                >
                    Notes: {data.obs}
                </Typography>

                <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
                    Status: {data.status} | Destination Branch: {data.filial_destino} |
                    Destination Warehouse: {data.armazem_destino}
                </Typography>

                <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                    <Table aria-label="products table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Remaining Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.produtos.map((product) => (
                                <TableRow key={product.id_produto}>
                                    <TableCell>{product.id_produto}</TableCell>
                                    <TableCell>{product.produto}</TableCell>
                                    <TableCell align="right">
                                        {product.quantidade_saldo}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default CardTable

