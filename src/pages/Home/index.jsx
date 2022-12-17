import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomButton from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import HomeTable from "../../components/home-table";
import { useState } from "react";

import FormDialog from "../../components/modal-form-truck";
const dataModalText = {
	carregando: {
		title: "Carregando",
		text: "formulário do carregamento formulário do carregamento formulário do carregamento formulário do carregamento "
	},
	descarregando: {
		title: "Descarregando",
		text: "formulário do descarregamento formulário do descarregamento formulário do descarregamento formulário do descarregamento"
	}
};
const HomePage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [dataModal, setDataModal] = useState({
		title: "",
		text: ""
	});

	const handleOpenModal = (title, text) => {
		setDataModal({
			title,
			text
		});
		console.log("abrir mdal");
		setIsOpenModal(true);
	};
	const handleCloseModal = () => {
		setIsOpenModal(false);
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap="30px"
			sx={{
				width: "100%",
				height: "100%"
				// border: "1px solid white"
			}}
		>
			<FormDialog
				isOpenModal={isOpenModal}
				handleCloseModal={handleCloseModal}
				dataModal={dataModal}
			/>
			<Box>
				<CustomButton
					title="Carregando"
					color={colors.greenAccent[600]}
					handleOpenModal={() =>
						handleOpenModal(
							dataModalText.carregando.title,
							dataModalText.carregando.text
						)
					}
				>
					<FontAwesomeIcon icon={faTruckMoving} />
				</CustomButton>

				<CustomButton
					title="Descarregando"
					color={colors.redAccent[600]}
					ml={20}
					handleOpenModal={() =>
						handleOpenModal(
							dataModalText.descarregando.title,
							dataModalText.descarregando.text
						)
					}
				>
					<FontAwesomeIcon icon={faTruckMoving} />
				</CustomButton>
			</Box>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="50%"
				sx={{
					backgroundColor: colors.blueOrigin[800],
					borderRadius: "8px"
				}}
			>
				<HomeTable />
			</Box>
		</Box>
	);
};

export default HomePage;
