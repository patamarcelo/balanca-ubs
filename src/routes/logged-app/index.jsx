import "./logged-app.css";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Toolbar from "../../components/global/ToolBar";
import TempDrawer from '../../components/drawer'
import { useState } from 'react'

const AuthApp = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isdrawerOpen, setIsdrawerOpen] = useState(false)
	
	const toggleDrawer = (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setIsdrawerOpen(!isdrawerOpen);
	};


	return (
		<div className="logged-app">
            <Toolbar 
			toggleDrawer={toggleDrawer}
			/>
			<TempDrawer 
			isdrawerOpen={isdrawerOpen}
			toggleDrawer={toggleDrawer}
			/>

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
