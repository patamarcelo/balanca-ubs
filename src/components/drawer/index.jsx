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
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import {
	selectUnidadeOpUser,
	selectIsDefensivosUser
} from "../../store/user/user.selector";

import { useEffect, useState } from "react";

export default function TempDrawer({ toggleDrawer, isdrawerOpen }) {
	const isDefensivosUser = useSelector(selectIsDefensivosUser);

	const navigate = useNavigate();

	const handlerNvaigate = (to) => {
		navigate(to);
	};

	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const [filteredArr, setFilteredArr] = useState([]);

	const NAVIGATION = [
		{
			title: "Início",
			icon: faHouse,
			to: "/",
			unidade: "all",
			permission: true
		},
		{
			title: "Relatório",
			icon: faChartSimple,
			to: "/report",
			unidade: "all",
			permission: true
		},
		{
			title: "Envio Semente",
			icon: faPaperPlane,
			to: "/sendseed",
			unidade: "ubs",
			permission: unidadeOpUser === "ubs" ? true : false
		},
		{
			title: "Ordens",
			icon: faClipboard,
			to: "/ordem",
			unidade: "ubs",
			permission: unidadeOpUser === "ubs" ? true : false
		},
		{
			title: "Defensivos",
			icon: faCalendarDays,
			to: "/defensivo",
			unidade: "ubs",
			permission: isDefensivosUser
		},
		{
			title: "Visitas",
			icon: faMapLocationDot,
			to: "/visitas",
			unidade: "ubs",
			permission: isDefensivosUser
		}
	];
	useEffect(() => {
		const newArr = NAVIGATION.filter((data) => data.permission === true);
		setFilteredArr(newArr);
	}, []);

	const list = (anchor) => (
		<Box
			sx={{
				width: 250
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
					{filteredArr.map((data, index) => (
						<ListItem
							key={index}
							disablePadding
							onClick={() => handlerNvaigate(data.to)}
						>
							<ListItemButton>
								<ListItemIcon>
									<FontAwesomeIcon icon={data.icon} />
								</ListItemIcon>
								<ListItemText primary={data.title} />
							</ListItemButton>
						</ListItem>
					))}
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
