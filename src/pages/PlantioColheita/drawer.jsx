import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";

import { ReactComponent as Diamond } from "../../utils/assets/img/diamond.svg";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTractor,
	faClipboard,
	faSheetPlastic
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

const drawerWidth = 130;

const PermanentDrawerLeft = ({
	handleNagivationIcon,
	selectedRoute,
	handlerRefresh
}) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();

	const handlerRota2 = () => console.log("handler Rota 2");
	const handlerRota3 = () => console.log("handler Rota 3");

	const navigateList = [
		{
			icon: faTractor,
			title: "Colheita",
			route: "rota 1",
			func: handlerRefresh
		},
		{
			icon: faClipboard,
			title: "Romaneios",
			route: "rota 2",
			func: handlerRota2
		},
		{
			icon: faSheetPlastic,
			title: "SRD",
			route: "rota 3",
			func: handlerRota3
		}
	];

	return (
		<Box sx={{ display: "flex" }}>
			<Drawer
				PaperProps={{
					sx: {
						backgroundColor: colors.blueOrigin[800]
						// borderRadius: "12px 0 0 12px"
					}
				}}
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box"
					},
					"& .MuiDrawer-root": {
						position: "fixed"
					},
					"& .MuiPaper-root": {
						position: "absolute"
					}
				}}
			>
				{/* <Box sx={{ overflow: "auto" }}> */}
				<Box >
					<List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
						{navigateList.map((data, index) => (
							<ListItem
								key={index}
								disablePadding
								selected={data.route === selectedRoute}
							>
								<ListItemButton
									onClick={() => {
										data.func();
										handleNagivationIcon(data.route);
									}}

									sx={{width: '10px'}}
								>
									<ListItemIcon sx={{ color: data.route === selectedRoute && 'white', minWidth: '30px' }}>
										<FontAwesomeIcon icon={data.icon} />
									</ListItemIcon>
									<ListItemText primary={data.title} sx={{ color: data.route === selectedRoute && 'white' }} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Divider />
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						mt="60px"
						sx={{
							width: "100%"
						}}
					>
						<Box
							sx={{
								width: "50px",
								height: "50px",
								cursor: 'pointer'
							}}
							onClick={() => navigate("/")}
						>
							<Diamond
								sx={{
									fontSize: "30px"
								}}
							/>
						</Box>
					</Box>
					{/* <List>
						{["Icon 1 ", "Icon 2 ", "Icon 3"].map((text, index) => (
							<ListItem key={text} disablePadding>
								<ListItemButton>
									<ListItemIcon>
										{index % 2 === 0 ? (
											<InboxIcon />
										) : (
											<MailIcon />
										)}
									</ListItemIcon>
									<ListItemText primary={text} />
								</ListItemButton>
							</ListItem>
						))}
					</List> */}
				</Box>
			</Drawer>
		</Box>
	);
};

export default PermanentDrawerLeft;
