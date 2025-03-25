import Table from "react-bootstrap/Table";
import styles from './tablesrd.module.css'

import { IconButton, Box, useTheme, } from "@mui/material";

import { tokens } from "../../../theme";

import { useState } from 'react'
import DeleteIcon from "@mui/icons-material/Delete";


import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import cotton from '../../../utils/assets/icons/cotton.png'
import question from '../../../utils/assets/icons/question.png'

import toast from "react-hot-toast";

const TableSrd = ({ data, setFilterDataArray }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [hoveredRow, setHoveredRow] = useState(null);




    const iconDict = [
        { cultura: "FEIJAO", icon: beans, alt: "feijao" },
        { cultura: "Feijão", icon: beans, alt: "feijao" },
        { cultura: "ARROZ", icon: rice, alt: "arroz" },
        { cultura: "SOJA", icon: soy, alt: "soja" },
        { cultura: "Algodão", icon: cotton, alt: "algodao" },

    ];

    const filteredAlt = (data) => {
        const filtered = iconDict.filter(
            (dictD) => data.includes(dictD.cultura)
        );

        if (filtered.length > 0) {
            return filtered[0].alt;
        }
        return "not_found";
    };

    const filteredIcon = (data) => {
        const filtered = iconDict.filter(
            (dictD) => data.includes(dictD.cultura)
        );

        if (filtered.length > 0) {
            return filtered[0].icon;
        }
        return question;
    };

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

    const handlerCopyData = (parcela) => {
        if (parcela?.ID_INTEGRACAO && parcela.ID_INTEGRACAO.trim() !== '') {
            navigator.clipboard.writeText(parcela?.ID_INTEGRACAO)
            toast.success(`ID Copiado!!: ${parcela.TICKET} - ID: ${parcela.ID_INTEGRACAO}`, {
                position: 'top-center',
            })
        } else {
            toast.error(`ID Integração não existe`, {
                position: 'top-center',
            })
        }
    }

    const handleDeleteRow = (ticket) => {
        console.log('ticket deletado, ', ticket)
        setFilterDataArray((prev) => {
            const removeTicket = prev.filter((data) => {
                return data.TICKET !== ticket
            })
            return removeTicket
        })
    }

    return (
        <Box pl={2}>
            <Table striped bordered hover style={{ width: "100%", color: colors.textColor[100] }} size="sm">
                {/* <Table striped bordered hover style={{ width: "100%", color: colors.textColor[100] }} size="sm" className={styles.mainTable}> */}
                <thead style={{ backgroundColor: colors.blueOrigin[300], color: 'white' }}>
                    <tr>
                        <th>Ticket</th>
                        <th>Romaneio</th>
                        <th>Data</th>
                        <th>Projeto</th>
                        <th>Parcelas</th>
                        <th>Cultura</th>
                        <th>Variedade</th>
                        <th>Placa</th>
                        <th>Motorista</th>
                        <th>Bruto</th>
                        <th>Tara</th>
                        <th>Liquido</th>
                        <th>Umidade</th>
                        <th>Impureza</th>
                        <th>Sacos</th>
                        <th>Destino</th>
                        {
                            hoveredRow &&
                            <th>Apagar</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data &&
                        data.map((parcela, i) => {
                            return (
                                <tr key={i}
                                    // className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${(parcela.UMIDADE_ENTRADA > 25 || parcela.IMPUREZA_ENTRADA > 3) && styles.warningRow}`}
                                    className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow}`}
                                    onMouseEnter={() => setHoveredRow(parcela.TICKET)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <td style={{ width: '70px' }}>{parseInt(parcela.TICKET)}</td>
                                    <td onClick={() => handlerCopyData(parcela)} style={{ width: '70px', cursor: 'pointer' }}>{parseInt(parcela?.ROMANEIO || 0)}</td>
                                    <td style={{ width: '105px' }}>{parcela.DT_PESAGEM_TARA.trim().split('-').reverse().join('/')}</td>
                                    <td style={{ width: '120px' }}>{parcela.PROJETO}</td>
                                    <td style={{ width: '100px' }}>{parcela.PARCELA.replace("'", '').replaceAll(';', ' ')}</td>
                                    <td style={{ width: '80px' }}>
                                        <img
                                            src={filteredIcon(parcela?.CULTURA)}
                                            alt={filteredAlt(
                                                parcela?.CULTURA
                                            )}
                                            style={{
                                                filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
                                                width: '20px',
                                                height: '20px'
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: '100px' }}>{parcela?.VARIEDADE?.replace(/arroz/gi, '')}</td>
                                    <td style={{ width: '100px' }}>{parcela?.PLACA?.slice(0, 3) + "-" + parcela?.PLACA?.slice(3, 7)}</td>
                                    <td style={{ width: '300px', overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{parcela.MOTORISTA}</td>
                                    <td>{formatWei(parcela.BRUTO)}</td>
                                    <td>{formatWei(parcela.TARA)}</td>
                                    <td>{formatWei(parcela.LIQUIDO)}</td>
                                    <td style={{ color: (formatDesc(parcela.UMIDADE_ENTRADA) === '0,00' || parcela.UMIDADE_ENTRADA < 19 ? 'red' : undefined), fontWeight: formatDesc(parcela.UMIDADE_ENTRADA) === '0,00' || parcela.UMIDADE_ENTRADA < 19 ? "bold" : undefined }}>{formatDesc(parcela.UMIDADE_ENTRADA)}</td>
                                    <td style={{ color: formatDesc(parcela.IMPUREZA_ENTRADA) === '0,00' && 'red', fontWeight: formatDesc(parcela.IMPUREZA_ENTRADA) === '0,00' && "bold" }}>{formatDesc(parcela.IMPUREZA_ENTRADA)}</td>
                                    <td style={{ color: formatDesc(parcela.SACOS_SECOS) === '0,00' && 'red', fontWeight: formatDesc(parcela.SACOS_SECOS) === '0,00' && "bold" }}>{formatDesc(parcela.SACOS_SECOS)}</td>
                                    <td>{parcela.DESTINO.split('-')[0]}</td>
                                    {hoveredRow === parcela.TICKET && (
                                        <td>
                                            <IconButton onClick={() => handleDeleteRow(parcela.TICKET)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>
                                    )}
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