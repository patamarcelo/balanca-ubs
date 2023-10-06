import classes from "./farmbox.module.css";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { red } from "@mui/material/colors";

import { useSelector } from "react-redux";

import { geralAppDetail } from "../../../store/plantio/plantio.selector";

import ProgressBarPage from "./progress-bar";

const ResumoDataPage = (props) => {
	const { showFutureAps, daysFilter } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dataGeral = useSelector(geralAppDetail(showFutureAps, daysFilter));
	const progressNumber =
		(dataGeral.geral.aplicado / dataGeral.geral.area) * 100;

	return (
		<Box sx={{ width: "90%" }}>
			<Box sx={{ padding: "10px" }}>
				{Object.keys(dataGeral.geral).map((data, i) => {
					return (
						<Box key={i} className={classes.geralDivResumoBody}>
							<span>{data}</span>
							<div className={classes.valueDivGeral}>
								{dataGeral.geral[data].toLocaleString("pt-br", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}
							</div>
						</Box>
					);
				})}
			</Box>
			{/* <Box mb={1}>
				<ProgressBarPage
					progressNumber={progressNumber}
					progressRealNumber={progressNumber.toFixed(2)}
				/>
			</Box> */}
		</Box>
	);
};

export default ResumoDataPage;
