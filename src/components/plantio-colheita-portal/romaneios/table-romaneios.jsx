import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DoneAll";

import Table from "react-bootstrap/Table";
import styles from "./romaneios.module.css";

const RomaneiosTable = ({ data, handleUpdateCarga }) => {
    if (data.length === 0) {
        return (
            <Box justifyContent={"center"} alignItems={"center"}>
                <Typography variant="h1" color={"white"}>
                    Sem Romaneios Pendentes
                </Typography>
            </Box>
        );
    }

    return (
        <Box width={"100%"} sx={{ maxHeight: "500px", overflow: "auto" }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Romaneio</th>
                        <th>Projeto</th>
                        <th>Parcelas</th>
                        <th>Placa</th>
                        <th>Motorista</th>
                        <th>Destino</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((carga, i) => {
                        return (
                            <tr
                                key={i}
                                className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow}`}
                            >
                                <td>
                                    {carga.relatorioColheita}
                                </td>
                                <td>
                                    {carga.fazendaOrigem}
                                </td>
                                <td>
                                    {carga.parcelasNovas.join(", ")}
                                </td>
                                <td>
                                    {carga.placa}
                                </td>
                                <td>
                                    {carga.motorista}
                                </td>
                                <td>
                                    {carga.fazendaDestino}
                                </td>
                                <td>
                                    <IconButton
                                        aria-label="delete"
                                        size="sm"
                                        color="success"
                                        onClick={e => handleUpdateCarga(e, carga)}
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Box>
    );
};

export default RomaneiosTable;
