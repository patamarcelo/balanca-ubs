import { Box, Typography, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import IconButton from "@mui/material/IconButton";
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
	faCalendarDays
} from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import {
	selectCurrentUser,
	selectUnidadeOpUser,
	selectIsDefensivosUser
} from "../../store/user/user.selector";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

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

	const handlerNavHome = () => {
		navigate("/");
	};

	const handlerReportNav = () => {
		navigate("/report");
	};

	const handlerSentSeed = () => {
		navigate("/sendseed");
	};

	const handlerDefensivos = () => {
		navigate("/defensivo");
	};

	const handlerLogout = () => {
		dispatch(logOffUser());
		signOutUser();
	};

	const print = (e) => {
		window.print();
	};

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			mt="20px"
			width="100%"
			mb={isNonMobile ? "20px" : "10px"}
			sx={{
				padding: "0px 10px 0px 10px"
			}}
		>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems={unidadeOpUser.length > 4 ? "start" : "center"}
				onClick={toggleDrawer}
				sx={{
					cursor: "pointer",
					width: "30px",
					height: "30px",
					marginRight: "20px"
				}}
			>
				<MenuIcon
					sx={{
						fontSize: "32px"
					}}
				/>
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
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					backgroundColor: colors.blueOrigin[800],
					padding: "0px 5px",
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`,
					border:
						theme.palette.mode === "light" && "0.5px solid black"
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
	);
};

export default Header;
