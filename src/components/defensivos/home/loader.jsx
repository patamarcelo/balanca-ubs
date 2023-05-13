import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Skeleton from "@mui/material/Skeleton";

const LoaderHomeSkeleton = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			height="90%"
			mt={2}
			sx={{
				backgroundColor: colors.blueOrigin[700],
				borderRadius: "8px",
				boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
			}}
		>
			<Box
				display="flex"
				// justifyContent="center"
				alignItems="center"
				sx={{
					width: "100%",
					height: "100%",
					padding: "20px"
				}}
			>
				<Typography style={{ width: "100%" }}>
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
					<Skeleton animation="wave" height={60} />
				</Typography>
			</Box>
		</Box>
	);
};

export default LoaderHomeSkeleton;
