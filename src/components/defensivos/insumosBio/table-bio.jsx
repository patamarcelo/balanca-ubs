import { Box, useTheme } from "@mui/material";
import Table from "react-bootstrap/Table";
import styles from './table-bio-styles.module.css'

import { tokens } from "../../../theme";

const TableBio = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data } = props

    const formatNumber = number => {
        return number.toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const formatEstoque = (fazendinha, ubs) => {
        if(!fazendinha && !ubs) return "-"
        if(fazendinha > 0 && !ubs) return fazendinha
        if(!fazendinha && ubs) return ubs
        const total = fazendinha + ubs 
        return total
    }
    return (
        <Box m={2} width={"100%"} p={2}>
            <Table
                striped
                bordered
                hover
                style={{ width: "100%", color: colors.textColor[100] }}
                size="sm"
                className={styles.bioTable}
            >
                <thead
                    style={{
                        backgroundColor: colors.blueOrigin[300],
                        color: "white"
                    }}
                >
                    <tr>
                        {/* <th>Projeto</th> */}
                        <th>Produto</th>
                        <th>Fazendinha</th>
                        <th>UBS</th>
                        <th>Estoque Total</th>
                        <th>Necessidade Farm</th>
                        <th>Saldo Produtos</th>
                        <th>id Farm</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((data, i) => {
                            const fazendinha = `0207-${data.id_farm_box}`
                            const ubs = `0209-${data.id_farm_box}`
                            const estoqueTotal = formatEstoque(data[fazendinha], data[ubs])
                            return (
                                <tr
                                    key={i}
                                    className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow
                                        }`}
                                >
                                    <td className={styles.titleRow}>{data?.descricao_produto?.split('-')[0]}</td>
                                    <td className={styles.numberRow} >{data[fazendinha] ? formatNumber(data[fazendinha]) : ' - '}</td>
                                    <td className={styles.numberRow} >{data[ubs] ? formatNumber(data[ubs]) : ' - '}</td>
                                    <td className={styles.numberRow} >{formatNumber(estoqueTotal)}</td>
                                    <td> - </td>
                                    <td> - </td>
                                    <td>{data.id_farm_box}</td>
                                </tr>
                            );
                        })}
                </tbody>
                <tfoot>

                </tfoot>
            </Table>
        </Box>

    );
}

export default TableBio;