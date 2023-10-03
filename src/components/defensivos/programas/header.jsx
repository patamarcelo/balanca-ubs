import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const HeaderComp = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "end",
				padding: "10px 10px",
				width: "100%",
				textAlign: "center",
				backgroundColor: colors.blueOrigin[500],
				marginBottom: "20px",
				borderRadius: "8px"
			}}
		>
			<Box>LOGOTIPO</Box>
			<Typography variant="h2" color={colors.primary[100]}>
				{data.nome_fantasia}
			</Typography>
			<Typography variant="h6" color={colors.primary[100]}>
				<b>{data.safra__safra}</b> - <b>{data.ciclo__ciclo}</b>
			</Typography>
		</Box>
	);
};

export default HeaderComp;
