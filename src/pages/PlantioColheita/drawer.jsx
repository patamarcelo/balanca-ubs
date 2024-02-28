import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTractor } from "@fortawesome/free-solid-svg-icons";

const drawerWidth = 180;

const PermanentDrawerLeft = ({ handleNagivationIcon, selectedRoute }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const navigateList = [
		{ icon: faTractor, title: "dap > 118 Ativa", route: "rota 1" },
		{ icon: faTractor, title: "dap > 80 Ativa", route: "rota 2" },
		{ icon: faTractor, title: "dap > 10 Ativa", route: "rota 3" }
	];

	return (
		<Box sx={{ display: "flex" }}>
			<Drawer
				PaperProps={{
					sx: {
						backgroundColor: colors.blueOrigin[800]
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
				<Box sx={{ overflow: "auto" }}>
					<List>
						{navigateList.map((data, index) => (
							<ListItem
								key={index}
								disablePadding
								selected={data.route === selectedRoute}
							>
								<ListItemButton
									onClick={() =>
										handleNagivationIcon(data.route)
									}
								>
									<ListItemIcon>
										<FontAwesomeIcon icon={data.icon} />
									</ListItemIcon>
									<ListItemText primary={data.title} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Divider />
					<List>
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
					</List>
				</Box>
			</Drawer>
		</Box>
	);
};

export default PermanentDrawerLeft;
