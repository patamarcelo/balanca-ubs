import { Box} from "@mui/material";
import "./index.css";
import { useEffect, useState } from "react";

import PageData from "./page-data";
import useMediaQuery from "@mui/material/useMediaQuery";

import LoaderPage from "../global/Loader";

const PrintLayout = ({ data }) => {
	
	
	const isNonMobile = useMediaQuery("(min-width: 1020px)");
	const isNonMobileLand = useMediaQuery("(min-width: 900px)");
	const [printValue, setPrintValue] = useState();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setPrintValue(data);
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
				id="printablediv"
				sx={{
					margin: "0 auto !important",
					transform: !isNonMobileLand && "scale(0.98)",
					padding: !isNonMobileLand && "0px",
					zoom: !isNonMobileLand && '70%'
				}}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{
						width: isNonMobile ? "90%" : "100%",
						maxWidth: "925px",
						// marginTop: !isNonMobileLand ? "-265px" : "0px",
						backgroundColor: "white",
						boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
					}}
				>
					{isLoading || !data ? (
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
						<PageData data={printValue} />
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
				id="printablediv2"
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
						<PageData data={printValue} />
					)}
				</Box>
			</Box>
		</div>
	);
};

export default PrintLayout;
