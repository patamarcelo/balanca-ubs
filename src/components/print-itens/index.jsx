import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

import PageData from "./page-data";

const PrintLayout = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const print = (e) => {
		console.log("imprimindo", e);
		window.print();
	};
	return (
		<Box
			width="100%"
			height="1000px"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			p="40px"
			sx={{
				margin: "0 auto !important",
				" body": {
					backgroundCOlor: "white !important"
				}
			}}
		>
			<Box
				sx={{
					cursor: "pointer",
					marginBottom: "10px"
				}}
				display="flex"
				width="70%"
				justifyContent="end"
			>
				<FontAwesomeIcon
					onClick={print}
					color={colors.grey[900]}
					icon={faPrint}
					size="xl"
				/>
			</Box>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="start"
				alignItems="start"
				// id="printablediv"
				sx={{
					width: "70%",
					height: "100%",
					// backgroundColor: "whitesmoke",
					backgroundColor: "white",
					boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
				}}
			>
				<PageData data={data} />
				<Box
					sx={{
						backgroundColor: colors.primary[900],
						width: "92%",
						height: "1px",
						margin: "0 auto",
						marginTop: "40px"
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
