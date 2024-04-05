import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";

const ResumoGeral = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { dest, data } = props;

    const [pesoTotal, setpesoTotal] = useState(0);
    const [totalQuant, setTotalQuant] = useState(0);

    useEffect(() => {
        if(dest === "Geral"){
            const total = data
            .reduce((acc, curr) => acc + curr.SACOS_SECOS, 0);
            setpesoTotal(total);
            const totalQUant = data
            .reduce((acc, curr) => acc + 1, 0);
            setTotalQuant(totalQUant);
        }else {

            const total = data
            .filter((data) => data.DESTINO.includes(dest))
            .reduce((acc, curr) => acc + curr.SACOS_SECOS, 0);
            setpesoTotal(total);
            const totalQUant = data
            .filter((data) => data.DESTINO.includes(dest))
            .reduce((acc, curr) => acc + 1, 0);
            setTotalQuant(totalQUant);
        }
    }, []);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "8px",
                border: "0.5px dotted black",
                padding: "8px 15px",
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '300px',
                // boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                backgroundColor: dest === "Geral" ? colors.greenAccent[400] : colors.blueOrigin[400],
            }}
        >
            <Box
            >
                <Typography variant="h3" color={colors.grey[900]}>
                    <b>
                        {dest}
                        </b>
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    height: '100%',
                }}
            >
                <Typography variant="h4" color={colors.grey[900]} sx={{fontWeight: '700', borderBottom: `1px solid ${colors.grey[900]}`}}>
                    {pesoTotal.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )} Scs
                </Typography>
                <Typography variant="h4" color={colors.grey[900]} sx={{fontWeight: '700'}}>
                    {totalQuant} {totalQuant > 1 ? "Cargas" : 'Carga'}
                </Typography>
            </Box>
        </Box>
    );
};

export default ResumoGeral;
