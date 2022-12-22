import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { useEffect, useState } from "react";

import PageData from "./page-data";
import useMediaQuery from "@mui/material/useMediaQuery";

import LoaderPage from "../global/Loader";

const PrintLayout = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width: 1020px)");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	}, []);

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
				sx={{
					width: isNonMobile ? "65%" : "100%",
					// marginBottom: "60px",
					marginTop: "50px",
					// backgroundColor: "whitesmoke",
					backgroundColor: "white",
					boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
					// boxShadow: "rgba(255, 255, 255, 0.35) 0px 5px 15px"
				}}
			>
				{isLoading ? (
					<Box
						width="100%"
						height="60vh"
						id="printablediv"
						sx={{
							padding: "20px 50px"
						}}
					>
						<LoaderPage isLoading={isLoading} />
					</Box>
				) : (
					<PageData data={data} />
				)}
			</Box>
		</Box>
	);
};

export default PrintLayout;
