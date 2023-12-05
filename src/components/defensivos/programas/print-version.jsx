import { Box, Typography } from "@mui/material";
const PrintVersion = ({ programData, version }) => {
	return (
		<Box style={{ textAlign: "center" }}>
			<Typography
				variant="h6"
				color="black"
				sx={{ fontFamily: "Times New Roman" }}
			>
				{programData.nome_fantasia} - Versão {version}
			</Typography>
		</Box>
	);
};

export default PrintVersion;
