import { Box, useTheme, Typography } from "@mui/material";
import Table from "react-bootstrap/Table";
import styles from './table-bio-styles.module.css'

import { tokens } from "../../../theme";

import { useState, useEffect } from "react";

const TableBio = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data, showDateTime } = props


    const [totalData, setTotalData] = useState({});

    const formatNumber = number => {
        return number.toLocaleString("pt-br", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
                if (acc['quantity_sts_open'] > 0 ) {
                    if(!isNaN(curr.quantity_sts_open)){    
                        acc["quantity_sts_open"] += curr.quantity_sts_open
                    }
                } else {
                    acc["quantity_sts_open"] = curr.quantity_sts_open
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
                
                if (acc['quantity_projeted_django_all'] > 0) {
                    acc["quantity_projeted_django_all"] += curr.quantity_projeted_django_all
                } else {
                    acc["quantity_projeted_django_all"] = curr.quantity_projeted_django_all
                }
                if (acc['quantity_planted_django_geral'] > 0) {
                    acc["quantity_planted_django_geral"] += curr.quantity_planted_django_geral
                } else {
                    acc["quantity_planted_django_geral"] = curr.quantity_planted_django_geral
                }

                return acc
            }, {})
            return totalData
        }
        const total = getTotal()
        setTotalData(total)
    }, [data]);


    return (
        <Box m={2} mt={1} width={"100%"} p={2} pt={1}>
            <Typography sx={{ fontSize: '12px' }} color={colors.textColor[100]}>{showDateTime}</Typography>
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
                        <th>Pré St</th>
                        <th>Previsto Plantado - {futDate}</th>
                        <th>Previsto Plantado - Geral</th>
                        <th>Previsto Planejado - {futDate}</th>
                        <th>Previsto Planejado - Geral</th>
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
                                    <td className={styles.numberRow}><span>{data?.quantity_sts_open ? formatNumber(data.quantity_sts_open) : '-'}</span> </td>
                                    <td className={styles.numberRow}><span>{data?.quantity_planted_django ? formatNumber(data.quantity_planted_django) : '-'}</span> </td>
                                    <td className={styles.numberRow}><span>{data?.quantity_planted_django_geral ? formatNumber(data.quantity_planted_django_geral) : '-'}</span> </td>
                                    <td className={styles.numberRow}><span>{data?.quantity_projeted_django ? formatNumber(data.quantity_projeted_django) : '-'}</span> </td>
                                    <td className={styles.numberRow}><span>{data?.quantity_projeted_django_all ? formatNumber(data.quantity_projeted_django_all) : '-'}</span> </td>
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
                        <th className={styles.numberRow}><span>{totalData['quantity_sts_open'] && formatNumber(totalData['quantity_sts_open'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quant_django_planted'] && formatNumber(totalData['quant_django_planted'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quantity_planted_django_geral'] && formatNumber(totalData['quantity_planted_django_geral'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quantity_projeted_django'] && formatNumber(totalData['quantity_projeted_django'])}</span></th>
                        <th className={styles.numberRow}><span>{totalData['quantity_projeted_django_all'] && formatNumber(totalData['quantity_projeted_django_all'])}</span></th>
                        <th colSpan={"1"}></th>
                    </tr>
                </tfoot>
            </Table>
        </Box>

    );
}

export default TableBio;