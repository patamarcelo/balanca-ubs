import { Box, useTheme } from "@mui/material";
import Table from "react-bootstrap/Table";
import styles from './table-bio-styles.module.css'

import { tokens } from "../../../theme";

import { useState, useEffect } from "react";

const TableBio = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data } = props


    const [totalData, setTotalData] = useState({});

    const formatNumber = number => {
        return number.toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const formatEstoque = (fazendinha, ubs) => {
        if (!fazendinha && !ubs) return "-"
        if (fazendinha > 0 && !ubs) return fazendinha
        if (!fazendinha && ubs) return ubs
        const total = fazendinha + ubs
        return total
    }

    const futureDay = () => {
        const today = new Date()
        const futureDay = new Date()
        futureDay.setDate(today.getDate() + 15)
        return futureDay.toLocaleString("pt-BR").split(',')[0]
    }

    const futDate = futureDay()



    useEffect(() => {
        const getTotal = () => {
            const totalData = data.reduce((acc, curr) => {
                const fazendinha = `0207-${curr.id_farm_box}`
                const quantityFaz = curr[fazendinha] !== undefined ? curr[fazendinha] : 0

                const ubs = `0209-${curr.id_farm_box}`
                const quantityUbs = curr[ubs] !== undefined ? curr[ubs] : 0
                if (acc['0209'] > 0) {
                    acc['0209'] += quantityUbs
                } else {
                    acc['0209'] = quantityUbs
                }

                if (acc['0207'] > 0) {
                    acc['0207'] += quantityFaz
                } else {
                    acc['0207'] = quantityFaz
                }

                if (acc['quant_farm'] > 0 ) {
                    if(!isNaN(curr.quantity_farmbox)){    
                        acc["quant_farm"] += curr.quantity_farmbox
                    }
                } else {
                    acc["quant_farm"] = curr.quantity_farmbox
                }
                
                if (acc['quant_django_planted'] > 0) {
                    acc["quant_django_planted"] += curr.quantity_planted_django
                } else {
                    acc["quant_django_planted"] = curr.quantity_planted_django
                }

                if (acc['quantity_projeted_django'] > 0) {
                    acc["quantity_projeted_django"] += curr.quantity_projeted_django
                } else {
                    acc["quantity_projeted_django"] = curr.quantity_projeted_django
                }

                return acc
            }, {})
            return totalData
        }
        const total = getTotal()
        setTotalData(total)
    }, [data]);


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
                        <th>Necessidade FarmBox</th>
                        <th>Previsto Plantado - {futDate}</th>
                        <th>Previsto Planejado - {futDate}</th>
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
                                    <td className={styles.titleRow}><span>{data?.descricao_produto?.split('-')[0]}</span></td>
                                    <td className={styles.numberRow}><span>{data[fazendinha] ? formatNumber(data[fazendinha]) : ' - '}</span></td>
                                    <td className={styles.numberRow}><span>{data[ubs] ? formatNumber(data[ubs]) : ' - '}</span></td>
                                    <td className={styles.numberRow}><span>{formatNumber(estoqueTotal)}</span></td>
                                    <td className={styles.numberRow}><span>{data?.quantity_farmbox ? formatNumber(data.quantity_farmbox) : '-'}</span> </td>
                                    <td className={styles.numberRow}><span>{data?.quantity_planted_django ? formatNumber(data.quantity_planted_django) : '-'}</span> </td>
                                    <td className={styles.numberRow}><span>{data?.quantity_projeted_django ? formatNumber(data.quantity_projeted_django) : '-'}</span> </td>
                                    <td>{data.id_farm_box}</td>
                                </tr>
                            );
                        })}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Totais</th>
                        <th className={styles.numberRow}><span>{totalData['0207'] && formatNumber(totalData['0207'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['0209'] && formatNumber(totalData['0209'])}</span></th>
                        <th className={styles.numberRow}><span>{formatNumber(formatEstoque(totalData['0207'], totalData['0209']))}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quant_farm'] && formatNumber(totalData['quant_farm'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quant_django_planted'] && formatNumber(totalData['quant_django_planted'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quantity_projeted_django'] && formatNumber(totalData['quantity_projeted_django'])}</span></th>
                        <th colSpan={"3"}></th>
                    </tr>
                </tfoot>
            </Table>
        </Box>

    );
}

export default TableBio;