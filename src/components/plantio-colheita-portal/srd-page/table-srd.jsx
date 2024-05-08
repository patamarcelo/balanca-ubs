import Table from "react-bootstrap/Table";
import styles from './tablesrd.module.css'

import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";


const TableSrd = ({data}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const formatWei = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    }

    const formatDesc = (data) => {
        return data.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    }

    return (  
        <Box pl={2}>
            <Table striped bordered hover style={{ width: "100%", color: colors.textColor[100] }} size="sm">
            {/* <Table striped bordered hover style={{ width: "100%", color: colors.textColor[100] }} size="sm" className={styles.mainTable}> */}
			<thead style={{backgroundColor: colors.blueOrigin[300], color: 'white'}}>
				<tr>
					<th>Ticket</th>
					<th>Data</th>
					<th>Projeto</th>
					<th>Parcelas</th>
					<th>Placa</th>
					<th>Motorista</th>
					<th>Bruto</th>
					<th>Tara</th>
					<th>Liquido</th>
					<th>Umidade</th>
					<th>Impureza</th>
					<th>Sacos Secos</th>
					<th>Destino</th>
				</tr>
			</thead>
            <tbody>
                {
                    data &&
                    data.map((parcela, i ) => {
                        return (
                            <tr key={i}
                            className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${(parcela.UMIDADE_ENTRADA > 25 || parcela.IMPUREZA_ENTRADA > 3) && styles.warningRow}`}
                            >
                                <td style={{width: '70px'}}>{parseInt(parcela.TICKET)}</td>
                                <td style={{width: '105px'}}>{parcela.DT_PESAGEM_TARA.trim().split('-').reverse().join('/')}</td>
                                <td style={{width: '160px'}}>{parcela.PROJETO}</td>
                                <td style={{width: '100px'}}>{parcela.PARCELA.replace("'",'').replaceAll(';', ' ')}</td>
                                <td style={{width: '100px'}}>{parcela?.PLACA?.slice(0,3) + "-" + parcela?.PLACA?.slice(3,7) }</td>
                                <td style={{width: '350px', overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap'}}>{parcela.MOTORISTA}</td>
                                <td>{formatWei(parcela.BRUTO)}</td>
                                <td>{formatWei(parcela.TARA)}</td>
                                <td>{formatWei(parcela.LIQUIDO)}</td>
                                <td style={{color: formatDesc(parcela.UMIDADE_ENTRADA) === '0,00' && 'red', fontWeight: formatDesc(parcela.UMIDADE_ENTRADA) === '0,00' && "bold"}}>{formatDesc(parcela.UMIDADE_ENTRADA)}</td>
                                <td style={{color: formatDesc(parcela.IMPUREZA_ENTRADA) === '0,00' && 'red', fontWeight: formatDesc(parcela.IMPUREZA_ENTRADA) === '0,00' && "bold"}}>{formatDesc(parcela.IMPUREZA_ENTRADA)}</td>
                                <td style={{color: formatDesc(parcela.SACOS_SECOS) === '0,00' && 'red', fontWeight: formatDesc(parcela.SACOS_SECOS) === '0,00' && "bold"}}>{formatDesc(parcela.SACOS_SECOS)}</td>
                                <td>{parcela.DESTINO.split('-')[0]}</td>
                            </tr>
                        )
                    })
                }

            </tbody>
            </Table>
        </Box>
    );
}
 
export default TableSrd;