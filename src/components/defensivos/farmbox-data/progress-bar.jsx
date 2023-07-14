import classes from "./farmbox.module.css";

import LinearProgress, {
	linearProgressClasses
} from "@mui/material/LinearProgress";

import { styled } from "@mui/material/styles";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const BorderLinearProgress = styled(LinearProgress)(({ theme, barColor }) => ({
	height: 8,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === "light" ? 200 : 500]
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: barColor
		// backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"
	}
}));

const barColor = (aplicado, progressRealNumber) => {
	if (aplicado < 100) {
		return "rgb(255,255,0,0.7)";
	}

	if (progressRealNumber > 100) {
		return "red";
	}
	return "rgb(0,128,0,0.9)";
};

const ProgressBarPage = (props) => {
	const { progressNumber, progressRealNumber } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<div className={classes.progressApp}>
			<div style={{ width: "90%" }}>
				<BorderLinearProgress
					variant="determinate"
					value={progressNumber}
					barColor={barColor(progressNumber, progressRealNumber)}
				/>
			</div>
			<div
				style={{
					color: colors.primary[100],
					fontSize: "0.8rem",
					fontStyle: "italic"
				}}
			>
				{progressRealNumber} %
			</div>
		</div>
	);
};

export default ProgressBarPage;
