import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const MapPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: colors.blueOrigin[800],
				borderRadius: "8px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<h1>MAPA</h1>
		</div>
	);
};

export default MapPage;
