import { Box } from "@mui/material";
import Table from "react-bootstrap/Table";
import styles from './romaneios.module.css'

const RomaneiosTable = ({ data }) => {
    return (
        <Box width={"100%"} sx={{maxHeight: '500px', overflow: 'auto'}}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Romaneio</th>
                        <th>Projeto</th>
                        <th>Parcelas</th>
                        <th>Placa</th>
                        <th>Motorista</th>
                        <th>Destino</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((carga, i) => {
                        return (
                            <tr
                            className={`${
								i % 2 !== 0 ? styles.oddRow : styles.evenRow
							}`}
                            >
                                <td>{carga.relatorioColheita}</td>
                                <td>{carga.fazendaOrigem}</td>
                                <td>{carga.parcelasNovas.join(', ')}</td>
                                <td>{carga.placa}</td>
                                <td>{carga.motorista}</td>
                                <td>{carga.fazendaDestino}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Box>
    );
};

export default RomaneiosTable;
