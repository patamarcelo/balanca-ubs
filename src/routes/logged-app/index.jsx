import "./logged-app.css";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import TempDrawer from '../../components/drawer'
import { useState } from 'react'
import Header from '../../components/global/Header'

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
		<Box className="logged-app"
		sx={{
			backgroundColor: colors.blueOrigin[900]
		}}
		>
			<Header 
			toggleDrawer={toggleDrawer}
			isdrawerOpen={isdrawerOpen}
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
				}}
			>
				<Typography variant="h6" color={colors.blueAccent[800]}>
					LOGADO
				</Typography>
			</Box>
		</Box>
	);
};
export default AuthApp;
