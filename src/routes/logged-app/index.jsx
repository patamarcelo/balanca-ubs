import "./logged-app.css";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import TempDrawer from "../../components/drawer";
import { useState } from "react";
import Header from "../../components/global/Header";
import HomePage from "../../pages/Home";
import ReportPage from "../../pages/Report";
import PrintPage from "../../pages/Print";

import { useLocation } from "react-router-dom";

import { Routes, Route } from "react-router-dom";

const AuthApp = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const location = useLocation();

	const [isdrawerOpen, setIsdrawerOpen] = useState(false);

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
		<Box
			className="logged-app"
			sx={{
				backgroundColor: colors.blueOrigin[900]
			}}
		>
			<Header toggleDrawer={toggleDrawer} isdrawerOpen={isdrawerOpen} />
			<TempDrawer
				isdrawerOpen={isdrawerOpen}
				toggleDrawer={toggleDrawer}
			/>

			<Box
				width="100%"
				height="100vh"
				display="flex"
				justifyContent="center"
				sx={{
					padding: "10px",
					height: "100vh",
					backgroundColor:
						location.pathname === "/print" ? "white !important" : ""
				}}
			>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/report" element={<ReportPage />} />
					<Route path="/print" element={<PrintPage />} />
				</Routes>
			</Box>
		</Box>
	);
};
export default AuthApp;
