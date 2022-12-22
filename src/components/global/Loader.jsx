import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "../../theme";

const LoaderPage = ({ isLoading, color }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<>
			{isLoading && (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="100%"
					height="50vh"
					sx={{
						// backgroundColor: colors.blueOrigin[700],
						borderRadius: "8px",
						boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
					}}
				>
					<Typography
						variant="h2"
						color={colors.yellow[700]}
						sx={{ fontWeight: "bold" }}
					>
						<CircularProgress sx={{ color: colors.primary[100] }} />
					</Typography>
				</Box>
			)}
		</>
	);
};

export default LoaderPage;
