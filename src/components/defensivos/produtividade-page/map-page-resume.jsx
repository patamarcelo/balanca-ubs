import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme} from "@mui/material";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import question from "../../../utils/assets/icons/question.png";

import styles from "./produtividade.module.css";
import { tokens } from '../../../theme'


const formaNumber = (number, decimals = 2) => {
    return number.toLocaleString(
        "pt-br",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })

}

const filteredAlt = (data) => {
    const filtered = iconDict.filter(
        (dictD) => dictD.cultura === data
    );

    if (filtered.length > 0) {
        return filtered[0].alt;
    }
    return "";
};

const filteredIcon = (data) => {
    const filtered = iconDict.filter(
        (dictD) => dictD.cultura === data
    );

    if (filtered.length > 0) {
        return filtered[0].icon;
    }
    return question;
};

const iconDict = [
    { cultura: "Feijão", icon: beans, alt: "feijao" },
    { cultura: "Arroz", icon: rice, alt: "arroz" },
    { cultura: "Soja", icon: soy, alt: "soja" }
];



const MapResumePage = ({ data }) => {
    const theme = useTheme();
	const colors = tokens(theme.palette.mode);
    // Grouping data by "cultura"
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.cultura]) {
            acc[item.cultura] = { total: 0, variedades: [] };
        }
        acc[item.cultura].total += item.total_area_colheita;
        acc[item.cultura].variedades.push(item);
        return acc;
    }, {});

    return (
        <TableContainer sx={{ maxWidth: "100%", margin: "auto", boxShadow: 8, borderRadius: '8px', padding: '0px' }} >
            <Table >
            <TableHead sx={{backgroundColor:'transparent'}}>
                    <TableRow sx={{ backgroundColor: "rgba(25,118,210,0.8)", borderTopLeftRadius: '8px' }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold", width: "100px", padding: '12px 5px 0px 5px!important', fontSize: '1.2em' }}>Cultura</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", width: "100px", padding: '12px 5px 0px 5px !important', fontSize: '1.2em' }}>Variedade</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", width: "100px", padding: '12px 5px 0px 5px !important', fontSize: '1.2em', textAlign: "right" }}>Área</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(groupedData).map(([cultura, { variedades, total }], index, arr) => (
                        <React.Fragment key={cultura}>
                            {variedades.map((variedade, index) => (
                                <TableRow key={variedade.variedade} 
                                sx={{ 
                                    borderBottom: "1px solid rgba(224, 224, 224, 1)", 
                                    "&:hover": { backgroundColor: "transparent" } // Removes hover effect
                                }}
                                >
                                    {/* <TableRow key={variedade.variedade} sx={{ backgroundColor: index % 2 === 0 ? "rgba(245,245,245,0.2)" : "rgba(245,245,245,0.4)" }}> */}
                                    {index === 0 && (
                                        <TableCell
                                            rowSpan={variedades.length}
                                            sx={{ fontWeight: "bold", verticalAlign: "middle", borderRight: "1px solid rgba(245,245,245,0.2)", padding: '7px 5px !important', color: 'black' }}
                                        >
                                            <img
                                                className={styles.imgIconResume}
                                                src={filteredIcon(cultura)}
                                                alt={filteredAlt(cultura)}
                                            />
                                            <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: 0, textAlign: 'center' }}>{formaNumber(total,0)} Há</p>
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ padding: '7px 5px !important', color: colors.grey[700], fontSize: '0.9em', fontWeight: 'bold' }}>{variedade.variedade || 'Não Definido'}</TableCell>
                                    <TableCell sx={{ textAlign: "right", padding: '5px 5px !important', color: 'black', fontWeight:  'bold' }}>{formaNumber(variedade.total_area_colheita)}</TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MapResumePage;