import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import Logo from "../../../utils/assets/img/logo.jpg";

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
				borderRadius: "8px",
				boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px"
			}}
		>
			<Box
				display="flex"
				justifyContent="start"
				sx={{
					width: "10px",
					height: "50px"
				}}
			>
				<img src={Logo} alt="logo" style={{ borderRadius: "4px" }} />
			</Box>
			<Typography variant="h2" color={"white"}>
				{data.nome_fantasia}
			</Typography>
			<Typography variant="h6" color={colors.primary[100]}>
				<b>{data.safra__safra}</b> - <b>{data.ciclo__ciclo}</b>
			</Typography>
		</Box>
	);
};

export default HeaderComp;
