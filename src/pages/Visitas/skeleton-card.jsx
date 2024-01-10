import { Box, useTheme } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { tokens } from "../../theme";

const SkeletonCard = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: "repeat(2, 1fr)",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: colors.blueOrigin[800],
				borderRadius: "12px",
				// gap: "10px",
				flexDirection: "column",
				width: "100%"
			}}
			mt={1}
			mb={1}
			p={1}
		>
			<Box>
				<Skeleton variant="text" sx={{ fontSize: "1.6rem" }} />
				<Skeleton
					variant="text"
					sx={{ fontSize: "1.1rem", width: "20%" }}
				/>
			</Box>
			<Skeleton
				variant="rectangular"
				width={200}
				height={200}
				sx={{ marginLeft: "auto", borderRadius: "12px" }}
			/>
		</Box>
	);
};

export default SkeletonCard;
