import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
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
	faPrint
} from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

const Header = ({ toggleDrawer, isdrawerOpen }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dispatch = useDispatch();
	const isNonMobile = useMediaQuery("(min-width: 800px)");
	const user = useSelector(selectCurrentUser);

	const location = useLocation();

	const navigate = useNavigate();

	const handlerNavHome = () => {
		navigate("/");
	};

	const handlerReportNav = () => {
		navigate("/report");
	};

	const handlerLogout = () => {
		dispatch(logOffUser());
		signOutUser();
		console.log("log out");
	};

	const print = (e) => {
		console.log("imprimindo", e);
		window.print();
	};

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			mt="20px"
			width="100%"
			mb="40px"
			sx={{
				padding: "0px 10px 0px 10px"
			}}
		>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
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
			</Box>
			<Box
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					backgroundColor: colors.blueOrigin[800],
					padding: "0px 5px",
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
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
				{location.pathname.length > 1 && (
					<IconButton onClick={handlerNavHome}>
						<FontAwesomeIcon
							icon={faHouse}
							color={colors.yellow[500]}
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
				<Typography variant="h6" color={colors.primary[100]}>
					{user.displayName}
				</Typography>
				<IconButton onClick={() => console.log("user")}>
					<FontAwesomeIcon
						icon={faUser}
						color={colors.blueOrigin[500]}
						size={isNonMobile ? "sm" : "xs"}
					/>
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
