import classes from "./farmbox.module.css";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faCircleExclamation
} from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ProgressCircularPage = (props) => {
	const { progressNumber, progressRealNumber } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<div
			style={{
				width: 45,
				height: 45
			}}
		>
			{/* <CircularProgressbar
				value={progressNumber}
				// text={
				// 	progressRealNumber === 100 ? (
				// 		<FontAwesomeIcon
				// 			icon={faCircleCheck}
				// 			color={colors.greenAccent[500]}
				// 		/>
				// 	) : (
				// 		`${progressRealNumber.toFixed(0)}%`
				// 	)
				// }
				text={`${progressRealNumber.toFixed(0)}%`}
				styles={buildStyles({
					// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
					strokeLinecap: "butt",
					// Text size
					textSize: "30px",
					// How long animation takes to go from one percentage to another, in seconds
					pathTransitionDuration: 0.5,

					// Can specify path transition in more detail, or remove it entirely
					// pathTransition: 'none',

					// Colors
					pathColor:
						progressRealNumber > 100
							? "red"
							: progressRealNumber < 100
							? "yellow"
							: "green",

					textColor: "whitesmoke",
					trailColor: "#d6d6d6",
					backgroundColor: "#3e98c7"
				})}
			/> */}
			<CircularProgressbarWithChildren
				value={progressRealNumber}
				// strokeWidth={50}
				styles={buildStyles({
					// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
					strokeLinecap: "butt",
					// Text size
					textSize: "30px",
					// How long animation takes to go from one percentage to another, in seconds
					pathTransitionDuration: 0.5,

					// Can specify path transition in more detail, or remove it entirely
					// pathTransition: 'none',

					// Colors
					pathColor:
						progressRealNumber > 100
							? "red"
							: progressRealNumber < 100
							? "yellow"
							: "green",

					textColor: "whitesmoke",
					trailColor: "#d6d6d6",
					backgroundColor: "#3e98c7"
				})}
			>
				{/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
				{progressRealNumber === 100 ? (
					<FontAwesomeIcon
						icon={faCheck}
						color={colors.greenAccent[500]}
					/>
				) : progressRealNumber > 100 ? (
					<FontAwesomeIcon
						icon={faCircleExclamation}
						color={colors.yellow[500]}
					/>
				) : (
					`${progressRealNumber.toFixed(0)}%`
				)}
			</CircularProgressbarWithChildren>
		</div>
	);
};

export default ProgressCircularPage;
