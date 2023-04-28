import "./logged-app.css";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import TempDrawer from "../../components/drawer";
import { useState } from "react";
import Header from "../../components/global/Header";
import HomePage from "../../pages/Home";
import ReportPage from "../../pages/Report";
import PrintPage from "../../pages/Print";
import SendSeed from "../../pages/SendSeed";
import OrdemPage from "../../pages/Ordens";
import PrintRCPage from "../../pages/Print-RC";
import DefensivoPage from "../../pages/Defensivo";

import { useLocation } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useSelector } from "react-redux";
import { selectUnidadeOpUser } from "../../store/user/user.selector";

const AuthApp = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const location = useLocation();

	const [isdrawerOpen, setIsdrawerOpen] = useState(false);
	const isNonMobile = useMediaQuery("(min-width: 900px)");

	const unidadeOpUser = useSelector(selectUnidadeOpUser);

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
				height="100%"
				display="flex"
				justifyContent="center"
				sx={{
					padding: "10px",
					overflow: "auto",
					height: "100%",
					backgroundColor:
						location.pathname === "/print"
							? "rgb(237, 234, 222) !important"
							: ""
				}}
			>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/report" element={<ReportPage />} />
					<Route path="/print" element={<PrintPage />} />
					<Route path="/rcprint" element={<PrintRCPage />} />
					{unidadeOpUser === "ubs" && (
						<Route path="/sendseed" element={<SendSeed />} />
					)}
					{unidadeOpUser === "ubs" && (
						<Route path="/ordem" element={<OrdemPage />} />
					)}
					{/* {unidadeOpUser === "ubs" && (
						<Route path="/defensivo" element={<DefensivoPage />} />
					)} */}
				</Routes>
			</Box>
		</Box>
	);
};
export default AuthApp;
