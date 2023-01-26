import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const EditModal = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box>
			<Typography variant="h6" color={colors.grey[100]}>
				EditModal
			</Typography>
		</Box>
	);
};

export default EditModal;
