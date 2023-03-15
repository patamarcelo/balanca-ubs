import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";
import AddButton from "../add-ordens/index";
import FormOrdens from "../form-ordens";

import TableOrdensPage from "../table-ordens";

const HomeOrdemPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="start"
			sx={{
				width: "100%",
				height: "100%",
				padding: "10px"
			}}
		>
			<Box
				sx={
					{
						// margin: "10px"
					}
				}
			>
				<AddButton isOpen={isOpen} setIsOpen={setIsOpen} />
			</Box>
			{isOpen && (
				<Box>
					<FormOrdens isOpen={isOpen} setIsOpen={setIsOpen} />
				</Box>
			)}
			{!isOpen && (
				<Box
					sx={{
						width: "100%",
						height: "100%"
					}}
				>
					<TableOrdensPage isOpen={isOpen} setIsOpen={setIsOpen} />
				</Box>
			)}
		</Box>
	);
};

export default HomeOrdemPage;
