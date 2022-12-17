import "./logged-app.css";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Toolbar from "../../components/global/ToolBar";

const AuthApp = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<div className="logged-app">
            <Toolbar />
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				sx={{
					height: "100vh",
                    backgroundColor: colors.blueOrigin[500]
				}}
			>
				<Typography variant="h6" color={colors.blueAccent[800]}>
					LOGADO
				</Typography>
			</Box>
		</div>
	);
};
export default AuthApp;
