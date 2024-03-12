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
import VisitasPage from "../../pages/Visitas";
import VisitaIDPage from "../../pages/VisitaId";

import { useLocation } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useSelector } from "react-redux";
import {
	selectUnidadeOpUser,
	selectIsDefensivosUser
} from "../../store/user/user.selector";
import PlantioColheitaPage from "../../pages/PlantioColheita";
import PageNotFound from "../../pages/NotFound";

import MenuIcon from "@mui/icons-material/Menu";

const AuthApp = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const location = useLocation();

	const [isdrawerOpen, setIsdrawerOpen] = useState(false);
	const isNonMobile = useMediaQuery("(min-width: 900px)");

	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const isDefensivosUser = useSelector(selectIsDefensivosUser);

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
			{
				isNonMobile ? 
				<Header toggleDrawer={toggleDrawer} isdrawerOpen={isdrawerOpen} />
				: 
				<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				justifyContent={"flex-start"}
				onClick={toggleDrawer}
				sx={{
					cursor: "pointer",
					width: "100%",
					height: "30px",
					marginRight: "20px",
					marginLeft: '10px',
					position: 'absolute',
					top: '10px'

				}}
			>
				<MenuIcon
					sx={{
						fontSize: "32px"
					}}
				/>
				</Box>
				
			}

			<TempDrawer
				isdrawerOpen={isdrawerOpen}
				toggleDrawer={toggleDrawer}
			/>

			<Box
				width="100%"
				height="100%"
				display="flex"
				justifyContent="center"
				alignItems={(location.pathname === "/rcprint" || location.pathname === "/print")  && 'center'}
				id="mainPrintDivContainer"
				sx={{
					padding: "10px",
					overflow: "auto",
					height: "100%",
					backgroundColor:
						location.pathname === "/print"
							? "lightgrey !important"
							: location.pathname.includes("visitas/")
							? "whitesmoke"
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
					{isDefensivosUser && (
						<Route path="/defensivo" element={<DefensivoPage />} />
					)}
					{isDefensivosUser && (
						<>
							<Route path="/visitas" element={<VisitasPage />} />
							<Route
								path="/visitas/:visitaId"
								element={<VisitaIDPage />}
							/>
						</>
					)}
					{isDefensivosUser && (
						<>
							<Route
								path="/plantio-colheita"
								element={<PlantioColheitaPage />}
							/>
						</>
					)}
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</Box>
		</Box>
	);
};
export default AuthApp;
