import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate } from "react-router-dom";

const VisitaIDPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const params = useParams();
	const navigate = useNavigate();
	const { visitaId } = params;
	return (
		<Box>
			<Button
				title="Voltar"
				onClick={() => navigate(-1)}
				variant="contained"
			>
				Voltar
			</Button>
			<Typography variant="h2" color={colors.textColor[100]}>
				Visita ID Page
				<p>Page ID: {visitaId}</p>
			</Typography>
		</Box>
	);
};

export default VisitaIDPage;
