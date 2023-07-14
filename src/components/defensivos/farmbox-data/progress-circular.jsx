import classes from "./farmbox.module.css";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ProgressCircularPage = (props) => {
	const { progressNumber, progressRealNumber } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<div
			style={{
				width: 40,
				height: 40
			}}
		>
			<CircularProgressbar
				value={progressNumber}
				text={`${progressRealNumber.toFixed(0)}%`}
				styles={buildStyles({
					// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
					strokeLinecap: "butt",
					// Text size
					textSize: "22px",
					// How long animation takes to go from one percentage to another, in seconds
					pathTransitionDuration: 0.5,

					// Can specify path transition in more detail, or remove it entirely
					// pathTransition: 'none',

					// Colors
					pathColor:
						progressRealNumber > 100
							? "red"
							: `rgba(0, 128, 0, ${
									(progressRealNumber / 100) * 1.5
							  })`,
					textColor: "whitesmoke",
					trailColor: "#d6d6d6",
					backgroundColor: "#3e98c7"
				})}
			/>
		</div>
	);
};

export default ProgressCircularPage;
