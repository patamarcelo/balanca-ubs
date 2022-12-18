import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ReactComponent as Diamond } from "../../utils/assets/img/diamond.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { faChartSimple } from "@fortawesome/free-solid-svg-icons"

import { useNavigate } from "react-router-dom";

const NAVIGATION = [
	{title: 'Home', icon: faHouse, to: '/'},
	{title: 'Report', icon: faChartSimple , to: '/report'},
]

export default function TempDrawer({ toggleDrawer, isdrawerOpen }) {
	const navigate = useNavigate();

	const handlerNvaigate = (to) => {
		navigate(to)
	}

	const list = (anchor) => (
		<Box
			sx={{
				width: 250,
			}}
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			alignItems="start"
			role="presentation"
			onClick={toggleDrawer}
			onKeyDown={toggleDrawer}
		>
			<Box
				sx={{
					width: "100%",
				}}
			>
				<List>
					{NAVIGATION.map(
						(data, index) => (
							<ListItem key={index} disablePadding
							onClick={() => handlerNvaigate(data.to)}
							>
								<ListItemButton
								>
									<ListItemIcon>
										<FontAwesomeIcon icon={data.icon} />
									</ListItemIcon>
									<ListItemText primary={data.title} />
								</ListItemButton>
							</ListItem>
						)
					)}
				</List>
				<Divider />
				{/* <List>
					{["All mail", "Trash", "Spam"].map((text, index) => (
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
						height: "50px"
					}}
				>
					<Diamond
						sx={{
							fontSize: "30px"
						}}
					/>
				</Box>
			</Box>
		</Box>
	);

	return (
		<div>
			<>
				<Drawer
					anchor="left"
					open={isdrawerOpen}
					onClose={toggleDrawer}
					sx={{
						".MuiPaper-root ": {
							// display: 'flex',
							// justifyContent: 'space-between',
							// backgroundColor: 'blue'
						}
					}}
				>
					{list("left")}
				</Drawer>
			</>
		</div>
	);
}
