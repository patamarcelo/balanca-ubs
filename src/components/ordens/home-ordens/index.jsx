import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";
import AddButton from "../add-ordens/index";
import FormOrdens from "../form-ordens";

import TableOrdensPage from "../table-ordens";
import CircularProgress from "@mui/material/CircularProgress";

import OrdemModal from "../modal-ordens";

const HomeOrdemPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpen, setIsOpen] = useState(false);
	const { isLoadingHome, ordems } = props;
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState([]);

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
			>
				<OrdemModal
					isOpenModal={isOpenModal}
					setIsOpenModal={setIsOpenModal}
					dataModal={dataModal}
				/>
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
			{!isOpen && isLoadingHome && (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="100%"
					height="100%"
					mt={4}
					sx={{
						backgroundColor: colors.blueOrigin[700],
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
			{!isOpen && !isLoadingHome && (
				<Box
					sx={{
						width: "100%",
						height: "100%"
					}}
				>
					<TableOrdensPage
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						ordems={ordems}
						setIsOpenModal={setIsOpenModal}
						setDataModal={setDataModal}
					/>
				</Box>
			)}
		</Box>
	);
};

export default HomeOrdemPage;
