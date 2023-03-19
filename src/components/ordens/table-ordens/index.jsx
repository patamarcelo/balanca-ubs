import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

// import { useState } from "react";
import TableOrdensEach from "../table-ordem-each";

const TableOrdensPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { ordems } = props;

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="start"
			mt={1}
			sx={{
				width: "100%",
				height: "100%",
				// backgroundColor: colors.blueOrigin[700],
				borderRadius: "8px"
			}}
		>
			<Box
				display="flex"
				flexDirection="column"
				sx={{
					width: "100%",
					height: "100%"
				}}
			>
				<TableOrdensEach ordems={ordems} />
			</Box>
		</Box>
	);
};

export default TableOrdensPage;
