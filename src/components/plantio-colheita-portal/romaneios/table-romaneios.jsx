import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DoneAll";

import Table from "react-bootstrap/Table";
import styles from "./romaneios.module.css";

import moment from "moment";



const RomaneiosTable = ({ data, handleUpdateCarga }) => {
    
    const formatWeight = (peso) => {
		return Number(peso).toLocaleString("pt-BR") + " Kg";
	};

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
        <Box width={"100%"}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Romaneio</th>
                        <th>Projeto</th>
                        <th>Parcelas</th>
                        <th>Placa</th>
                        <th>Motorista</th>
                        <th>Destino</th>
                        <th>Bruto</th>
                        <th>Tara</th>
                        <th>Líquido</th>
                        <th>Saída</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((carga, i) => {
                        const newDate = carga.syncDate.toDate().toLocaleString('pt-BR')
                        return (
                            <tr
                                key={i}
                                className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow}`}
                            >
                                <td>
                                    {newDate}
                                </td>
                                <td>
                                    {carga.relatorioColheita}
                                </td>
                                <td>
                                    {carga.fazendaOrigem}
                                </td>
                                <td>
                                    {carga.parcelasNovas.sort((a,b) => a.localeCompare(b)).join(", ")}
                                </td>
                                <td>
                                {carga.placa.slice(0, 3)}-
									{carga.placa.slice(3, 12)}
                                </td>
                                <td>
                                    {carga.motorista}
                                </td>
                                <td>
                                    {carga.fazendaDestino}
                                </td>
                                <td>{carga.pesoBruto ? formatWeight(carga.pesoBruto) : formatWeight(0)}</td>
                                <td>{carga.tara ? formatWeight(carga.tara) : formatWeight(0)}</td>
                                <td>{carga.liquido ? formatWeight(carga.liquido) : formatWeight(0)}</td>
                                <td>{carga?.saida ? carga?.saida.toDate().toLocaleString('pt-BR') : '-'}</td>
                                <td>
                                    <IconButton
                                        aria-label="delete"
                                        size="sm"
                                        color="success"
                                        onClick={e => handleUpdateCarga(e, carga)}
                                        style={{padding: '2px'}}
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
