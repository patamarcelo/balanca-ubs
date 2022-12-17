import AppBar from "@mui/material/AppBar";
import { useTheme } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";

import LoadingButton from "@mui/lab/LoadingButton";
import CachedIcon from "@mui/icons-material/Cached";
import { Box } from "@mui/material";

import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";

import { tokens } from "../../theme";
import { logOffUser } from "../../store/user/user.action";
import { useDispatch } from "react-redux";

import { signOutUser } from "../../utils/firebase/firebase";

import { useSelector } from "react-redux";
import {
	selectCurrentUser,
	selectIsAdminUser
} from "../../store/user/user.selector";
import { useState } from "react";

import { ReactComponent as Diamond } from "../../utils/assets/img/diamond.svg";

const ButtonAppBar = ({toggleDrawer}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isAdmin = useSelector(selectIsAdminUser);
	const user = useSelector(selectCurrentUser);
	const [loadingPage, setLoadingPage] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handlerHomeNav = () => {
		navigate("/");
	};

	const handlerAdminNav = () => {
		navigate("/admin");
	};

	const handlerLogout = () => {
		dispatch(logOffUser());
		signOutUser();
		console.log("log out");
	};

	const handlerRefreshPage = () => {
		setLoadingPage(true);
		setTimeout(() => {
			window.location.reload(true);
		}, 1000);
	};

	

	return (
		<AppBar
			position="fixed"
			sx={{
				backgroundColor: colors.blueOrigin[900],
				borderTop: "none"
			}}
		>
			<Toolbar>
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
					<Diamond
						sx={{
							fontSize: "60px"
						}}
					/>
				</Box>
				{/* {
					isAdmin &&
				<IconButton
				size="large"
				edge="start"
				color="success"
				aria-label="menu"
				sx={{ mr: 2 }}
				onClick={() => {
					handlerAdminNav();
				}}
				>
					<BarChartIcon sx={{fontSize: '30px'}}/>
				</IconButton>
				} */}
				<IconButton
					size="large"
					edge="start"
					color="success"
					aria-label="menu"
					sx={{ mr: 2 }}
					onClick={() => {
						handlerRefreshPage();
					}}
				>
					{loadingPage ? (
						<CachedIcon
							sx={{
								fontSize: "30px",
								animation: "spin 1.7s linear infinite",
								"@keyframes spin": {
									"0%": {
										transform: "rotate(360deg)"
									},
									"100%": {
										transform: "rotate(0deg)"
									}
								}
							}}
						/>
					) : (
						<CachedIcon sx={{ fontSize: "30px" }} />
					)}
				</IconButton>
				<Box
				sx={{
				margin: 'auto 0',
				flexGrow: 1,
				textAlign: 'right'
				}}
				>
					<Typography variant="h3">UBS</Typography>
				</Box>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
				{user?.displayName ? user.displayName : "Usuário"}
				<IconButton
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					// onClick={handleMenu}
					color={!isAdmin ? "info" : "secondary"}
				>
					<AccountCircle sx={{ fontSize: "30px" }} />
				</IconButton>
				<IconButton onClick={handlerLogout}>
					<PowerSettingsNewOutlinedIcon
						style={{
							color: colors.redAccent[500],
							fontSize: "30px"
						}}
					/>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default ButtonAppBar;
