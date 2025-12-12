import { useState, useContext, useEffect } from "react";
import {
	Box,
	Typography,
	useTheme,
	Paper,
	IconButton,
	Slide
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { signOutUser } from "../../utils/firebase/firebase";
import { useDispatch } from "react-redux";
import { logOffUser } from "../../store/user/user.action";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faUser,
	faChartSimple,
	faPrint,
	faPaperPlane,
	faCalendarDays,
	faTractor,
	faPowerOff
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
	selectCurrentUser,
	selectUnidadeOpUser,
	selectIsDefensivosUser
} from "../../store/user/user.selector";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { toggleHeader } from "../../store/ui/ui.actions";
import SafraCicloComp from "../defensivos/home/safra-ciclo";

import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";

import { setUseMulti } from "../../store/plantio/plantio.actions";
import { selectUseMulti } from "../../store/plantio/plantio.selector";



const Header = ({ toggleDrawer, isdrawerOpen }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const colorMode = useContext(ColorModeContext);
	const dispatch = useDispatch();
	const isNonMobile = useMediaQuery("(min-width: 800px)");
	const isNonMobileLand = useMediaQuery("(min-width: 900px)");

	const user = useSelector(selectCurrentUser);
	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const isDefensivosUser = useSelector(selectIsDefensivosUser);

	const location = useLocation();
	const navigate = useNavigate();

	const visible = useSelector((state) => state.ui.headerVisible);

	const useMultiValue = useSelector(selectUseMulti)

	const handlerNavHome = () => navigate("/");
	const handlerReportNav = () => navigate("/report");
	const handlerSentSeed = () => navigate("/sendseed");
	const handlerDefensivos = () => navigate("/defensivo");
	const handlerPlantioColheita = () => navigate("/plantio-colheita");

	const handlerLogout = () => {
		dispatch(logOffUser());
		signOutUser();
		handlerNavHome();
	};

	const handleChange = (event) => {
		const value = event.target.checked;
		dispatch(setUseMulti(value));
	};

	const print = () => window.print();
	useEffect(() => {
		if (location.pathname === "/defensivo") {
			dispatch(toggleHeader())
		}
	}, [location, dispatch]);

	return (
		<>
			{/* Botão flutuante para mostrar/ocultar header */}
			<Box
				sx={{
					position: "fixed",
					top: 0,
					right: !visible ? "2%" : "-1%",
					transform: "translateX(-50%)",
					zIndex: 1301,
					bgcolor: colors.primary[400],
					borderRadius: "0 0 8px 8px",
					boxShadow: 3,
					p: "2px 6px",
					cursor: "pointer",
					transition: "right 0.3s ease, transform 0.3s ease" // <- aqui!
				}}
				onClick={() => dispatch(toggleHeader())}
			>
				<IconButton size="small">
					{visible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</Box>

			{/* Header com slide */}
			<Slide direction="down" in={visible} mountOnEnter unmountOnExit>
				<Box
					display={"flex"}
					justifyContent="space-between"
					alignItems="center"
					mt="20px"
					width="100%"
					mb={isNonMobile ? "10px" : "10px"}
					sx={{
						padding: "0px 10px",
						zIndex: 1300,
						position: "relative"
					}}
				>
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems={
							unidadeOpUser.length > 4 ? "start" : "center"
						}
						onClick={toggleDrawer}
						sx={{
							cursor: "pointer",
							width: "30px",
							height: "30px",
							marginRight: "20px"
						}}
					>
						<MenuIcon sx={{ fontSize: "32px" }} />
						<Typography
							variant="h6"
							color={colors.grey[300]}
							style={{
								textTransform:
									unidadeOpUser.length > 4
										? "capitalize"
										: "uppercase"
							}}
						>
							{unidadeOpUser}
						</Typography>
					</Box>
					<Box
						sx={{
							position: 'fixed',
							top: '0',
							display: 'flex',
							alignItems: 'center',
							gap: '30px',
							justifyContent: 'center',
							marginTop: '15px !important',
							marginLeft: '100px !important',
						}}
					>
						<SafraCicloComp />
						<Tooltip title="Possibilidade de filtrar mais de 1 ciclo na Produtividade" arrow>
							<FormControlLabel
								sx={{
									display: "flex",
									alignItems: "center",
									paddingTop: '15px',
									gap: 1,
									".MuiFormControlLabel-label": {
										fontWeight: 600,
										color: useMultiValue ? "#2e7d32" : "#555",
									},
								}}
								control={
									<Switch
										checked={useMultiValue}
										onChange={handleChange}
										color="success"
									/>
								}
								label={useMultiValue ? "Multi" : "Single"}
							/>
						</Tooltip>
					</Box>

					<Box
						display={"flex"}
						component={Paper}
						elevation={6}
						justifyContent="space-around"
						alignItems="center"
						sx={{
							backgroundColor: colors.blueOrigin[800],
							padding: "0px 5px",
							borderRadius: "8px",
							marginRight: '3%',
							border:
								theme.palette.mode === "light" &&
								"0.5px solid black"
						}}
					>
						{location.pathname.includes("print") && (
							<IconButton onClick={print}>
								<FontAwesomeIcon
									icon={faPrint}
									color={colors.blueAccent[500]}
									size={isNonMobile ? "sm" : "xs"}
								/>
							</IconButton>
						)}

						{isDefensivosUser &&
							!location.pathname.includes("defensivo") && (
								<IconButton onClick={handlerDefensivos}>
									<FontAwesomeIcon
										icon={faCalendarDays}
										color={colors.primary[100]}
										size={isNonMobile ? "sm" : "xs"}
									/>
								</IconButton>
							)}

						{isDefensivosUser &&
							!location.pathname.includes("plantio-colheita") && (
								<IconButton onClick={handlerPlantioColheita}>
									<FontAwesomeIcon
										icon={faTractor}
										color={colors.greenAccent[300]}
										size={isNonMobile ? "sm" : "xs"}
									/>
								</IconButton>
							)}

						{!location.pathname.includes("sendseed") &&
							unidadeOpUser === "ubs" && (
								<IconButton onClick={handlerSentSeed}>
									<FontAwesomeIcon
										icon={faPaperPlane}
										color={colors.blueAccent[500]}
										size={isNonMobile ? "sm" : "xs"}
									/>
								</IconButton>
							)}

						{location.pathname.length > 1 && (
							<IconButton onClick={handlerNavHome}>
								<FontAwesomeIcon
									icon={faHouse}
									color={colors.primary[100]}
									size={isNonMobile ? "sm" : "xs"}
								/>
							</IconButton>
						)}

						{!location.pathname.includes("report") && (
							<IconButton onClick={handlerReportNav}>
								<FontAwesomeIcon
									icon={faChartSimple}
									color={colors.greenAccent[500]}
									size={isNonMobile ? "sm" : "xs"}
								/>
							</IconButton>
						)}

						<Typography
							variant="h6"
							color={
								theme.palette.mode === "dark"
									? colors.grey[100]
									: "black"
							}
						>
							<Box
								display="flex"
								flexDirection="column"
								justifyContent="center"
								alignItems="center"
								mt="2px"
								mb="2px"
							>
								<p style={{ margin: 0 }}>{user.displayName}</p>
							</Box>
						</Typography>

						<IconButton onClick={() => console.log("user")}>
							<FontAwesomeIcon
								icon={faUser}
								color={colors.blueOrigin[500]}
								size={isNonMobile ? "sm" : "xs"}
							/>
						</IconButton>

						<IconButton onClick={colorMode.toggleColorMode}>
							{theme.palette.mode === "dark" ? (
								<DarkModeOutlinedIcon />
							) : (
								<LightModeOutlinedIcon />
							)}
						</IconButton>

						<IconButton onClick={handlerLogout}>
							<FontAwesomeIcon
								icon={faPowerOff}
								color={colors.redAccent[500]}
								size={isNonMobile ? "sm" : "xs"}
							/>
						</IconButton>
					</Box>
				</Box>
			</Slide>
		</>
	);
};

export default Header;