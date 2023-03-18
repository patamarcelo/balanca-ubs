import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";
import AddButton from "../add-ordens/index";
import FormOrdens from "../form-ordens";

import TableOrdensPage from "../table-ordens";

const HomeOrdemPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpen, setIsOpen] = useState(false);
	const { isLoadingHome } = props;

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
				display="flex"
				gap="10px"
				justifyContent="start"
				alignItems="center"
				sx={
					{
						// margin: "10px"
					}
				}
			>
				{!isOpen && (
					<Box sx={{ width: "auto !important" }}>
						<AddButton
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							disabled={isOpen}
						/>
					</Box>
				)}
				{isOpen && (
					<Button
						type="reset"
						onClick={() => {
							setIsOpen(false);
						}}
						color="error"
						variant="contained"
						sx={{ mr: "15px" }}
					>
						Cancelar
					</Button>
				)}
			</Box>
			{isOpen && (
				<Box>
					<FormOrdens isOpen={isOpen} setIsOpen={setIsOpen} />
				</Box>
			)}
			{!isOpen && !isLoadingHome && (
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
