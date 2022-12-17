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

export default function TempDrawer({ toggleDrawer, isdrawerOpen }) {
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
					width: "100%"
				}}
			>
				<List>
					{["Inbox", "Starred", "Send email", "Drafts"].map(
						(text, index) => (
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
						)
					)}
				</List>
				<Divider />
				<List>
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
				</List>
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
