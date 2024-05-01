import { Typography, useTheme, Box } from "@mui/material";
import { tokens } from "../../../theme";

const ResumoHeader = props => {
    const { data: { fazenda, peso, count }, mtComp, mlComp } = props;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"250px"}
            borderRadius={"8px"}
            border={`1px dotted ${colors.textColor[100]}`}
            sx={{
                padding: "5px 20px",
                backgroundColor:
                    fazenda === "Geral"
                        ? colors.greenAccent[400]
                        : fazenda === "Descarregando" || fazenda === "Trânsito"
                            ? colors.yellow[300]
                            : colors.blueOrigin[400]
                
            }}
            mt={mtComp && mtComp}
            ml={mlComp && mlComp}
        >
            <Box>
                <Typography
                    sx={{ fontWeight: "bold" }}
                    variant="h5"
                    color={fazenda === "Descarregando" || fazenda === "Trânsito" || fazenda ===  "Geral" ? colors.textColor[200] : "white"}
                // color={colors.primary[800]}
                >
                    {fazenda.replace("Projeto", "")}
                </Typography>
            </Box>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-around"}
                alignItems={"end"}
            >
                {peso &&
                    peso > 0 &&
                    <Typography
                        variant="h5"
                        color={fazenda === "Descarregando" || fazenda === "Trânsito" || fazenda ===  "Geral" ? colors.textColor[200] : "white"}
                        sx={{
                            fontWeight: "bold",
                            borderBottom: `1px solid ${fazenda === "Descarregando" || fazenda === "Trânsito" || fazenda ===  "Geral" ? colors.textColor[200] : "white"}`
                        }}
                    >
                        {(peso / 60).toLocaleString("pt-br", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}{" "}
                        Scs
                    </Typography>}
                <Typography
                    variant="h5"
                    color={fazenda === "Descarregando" || fazenda === "Trânsito" || fazenda ===  "Geral" ? colors.textColor[200] : "white"}
                    sx={{ fontWeight: "bold" }}
                >
                    {count} {count > 1 || count === 0 ? "Cargas" : "Carga"}
                </Typography>
            </Box>
        </Box>
    );
};

export default ResumoHeader;
