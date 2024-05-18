import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const InsumosBioPage = () => {
    const theme = useTheme();
	const colors = tokens(theme.palette.mode);
    const useThemeHere = theme.palette.mode
    return (  
        <Box
        sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: useThemeHere !== 'dark' && "whitesmoke",
            borderRadius: "8px",
        }}
        >
            <Typography color={colors.textColor[100]} variant="h1">Insumos Bio Page</Typography>
        </Box>
    );
}
 
export default InsumosBioPage;