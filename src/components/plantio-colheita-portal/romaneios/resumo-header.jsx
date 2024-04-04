import { Typography, useTheme, Box } from "@mui/material";
import { tokens } from "../../../theme";

const ResumoHeader = (props) => {
    const {
        data: { fazenda, peso, count }
    } = props;

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
            sx={{ padding: "5px 20px", backgroundColor: fazenda === "Geral" ? colors.greenAccent[400] : colors.blueAccent[300] }}
        >
            <Box>
                <Typography
                    sx={{ fontWeight: "bold" }}
                    variant="h5"
                    color={colors.textColor[200]}
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
                {peso && peso > 0 && (
                    <Typography
                        variant="h5"
                        color={colors.grey[900]}
                        sx={{
                            fontWeight: "bold",
                            borderBottom: `1px solid ${colors.textColor[200]}`
                        }}
                    >
                        {(peso / 60).toLocaleString("pt-br", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}{" "}
                        Scs
                    </Typography>
                )}
                <Typography
                    variant="h5"
                    color={colors.grey[900]}
                    sx={{ fontWeight: "bold" }}
                >
                    {count} Cargas
                </Typography>
            </Box>
        </Box>
    );
};

export default ResumoHeader;
