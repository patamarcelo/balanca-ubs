import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

import PageData from "./page-data";
import useMediaQuery from "@mui/material/useMediaQuery";

const PrintLayout = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width: 1020px)");

	return (
		<Box
			width="100%"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			p="5px 40px 40px 40px"
			sx={{
				margin: "0 auto !important",
				" body": {
					// backgroundCOlor: "white !important"
				}
			}}
		>
			<Box
				display="flex"
				// flexDirection="column"
				justifyContent="center"
				alignItems="center"
				id="printablediv"
				sx={{
					width: isNonMobile ? "90%" : "100%",
					// marginBottom: "60px",
					marginTop: "50px",
					// backgroundColor: "whitesmoke",
					backgroundColor: "white",
					boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
					// boxShadow: "rgba(255, 255, 255, 0.35) 0px 5px 15px"
				}}
			>
				<PageData data={data} />
			</Box>
		</Box>
	);
};

export default PrintLayout;
