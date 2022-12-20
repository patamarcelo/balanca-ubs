import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

import PageData from "./page-data";

const PrintLayout = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			width="100%"
			height="1000px"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			p="5px 40px 40px 40px"
			mt="-50px"
			sx={{
				margin: "0 auto !important",
				" body": {
					// backgroundCOlor: "white !important"
				}
			}}
		>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="start"
				alignItems="start"
				id="printablediv"
				sx={{
					width: "70%",
					minHeight: "1020px",
					marginBottom: "60px",
					marginTop: '50px',
					// backgroundColor: "whitesmoke",
					backgroundColor: "white",
					boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
					// boxShadow: "rgba(255, 255, 255, 0.35) 0px 5px 15px"
				}}
			>
				<PageData data={data} />
				<Box
					sx={{
						backgroundColor: colors.primary[900],
						width: "92%",
						height: "0.1px",
						margin: "0 auto"
					}}
				>
					m
				</Box>
				<PageData data={data} />
			</Box>
		</Box>
	);
};

export default PrintLayout;
