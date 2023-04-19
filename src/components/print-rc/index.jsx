import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./index.module.css";
import { useEffect, useState } from "react";

import PageRcData from "./page-rc-data";
import useMediaQuery from "@mui/material/useMediaQuery";

import LoaderPage from "../global/Loader";

import { useSelector } from "react-redux";
import { selectTruckLoadsFormatData } from "../../store/trucks/trucks.selector";

const PrintRCLayout = ({ data }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width: 1020px)");
	const isNonMobileLand = useMediaQuery("(min-width: 900px)");
	const newData = useSelector(selectTruckLoadsFormatData);

	const [isLoading, setIsLoading] = useState(true);
	const [printData, setPrintData] = useState([]);

	useEffect(() => {
		const filterNewData = newData.filter(
			(filterData) => filterData.id === data.id
		);
		setPrintData(filterNewData);
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	}, []);

	return (
		<div className="print-container">
			<Box
				width="100%"
				display="flex"
				// flexDirection="column"
				justifyContent="center"
				alignItems="start"
				p="5px 30px 30px 30px"
				// id="printablediv"
				sx={{
					margin: "0 auto !important",
					transform: !isNonMobileLand && "scale(0.6)",
					marginTop: "-5px",
					padding: !isNonMobileLand && "0px",
					" body": {
						// backgroundCOlor: "white !important"
					}
				}}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						width: isNonMobile ? "90%" : "100%",
						maxWidth: "925px",
						marginTop: !isNonMobileLand ? "-265px" : "0px",
						backgroundColor: "white",
						boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
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
						<PageRcData printValue={printData} />
					)}
				</Box>
			</Box>
			<Box
				width="100%"
				display="flex"
				// flexDirection="column"
				justifyContent="center"
				alignItems="start"
				p="5px 30px 30px 30px"
				// id="printablediv2"
				sx={{
					margin: "0 auto !important",
					transform: !isNonMobileLand && "scale(0.6)",
					marginTop: "-5px",
					padding: !isNonMobileLand && "0px",
					display: "none",
					" body": {
						// backgroundCOlor: "white !important"
					}
				}}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						width: isNonMobile ? "90%" : "100%",
						maxWidth: "925px",
						marginTop: !isNonMobileLand ? "-265px" : "0px",
						backgroundColor: "white",
						boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
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
						<PageRcData printValue={printData} />
					)}
				</Box>
			</Box>
		</div>
	);
};

export default PrintRCLayout;
