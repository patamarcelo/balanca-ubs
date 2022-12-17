import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomButton from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import HomeTable from "../../components/home-table";
import { useState, useEffect } from "react";

import FormDialog from "../../components/modal-form-truck";
const dataModalText = {
	carregando: {
		title: "Carregando",
		color: 'success',
		text: "formulário do carregamento formulário do carregamento formulário do carregamento formulário do carregamento "
	},
	descarregando: {
		title: "Descarregando",
		color: 'error',
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

	const [truckValues, setTruckValues] = useState({})

	const handleOpenModal = (obj) => {
		setDataModal({
			title: obj.title,
			text: obj.text,
			color: obj.color
		});
		setIsOpenModal(true);
	};
	const handleCloseModal = (e) => {
		setIsOpenModal(false);
		setTruckValues({})
	};
	const handleCloseModalEsc = (event) => {
		if (event.type === "keydown" && event.key === "Escape") {
			setIsOpenModal(false);
			setTruckValues({})
		}
	};


	const handleChangeTruck = e => {
		if(typeof e.$L === 'string') {
			console.log(typeof e.$d)
			const newDate = new Date(e.$d)
			setTruckValues({ ...truckValues, data: newDate });
		} else {
			setTruckValues({ ...truckValues, [e.target.name]: e.target.value });
		}
	};

	useEffect(() => {
		setTruckValues({ ...truckValues, data: new Date() });
	},[])

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
				handleCloseModalEsc={handleCloseModalEsc}
				handleChangeTruck={handleChangeTruck}
				truckValues={truckValues}
			/>
			<Box>
				<CustomButton
					title="Carregando"
					color={colors.greenAccent[600]}
					handleOpenModal={() =>
						handleOpenModal(dataModalText.carregando)
					}
				>
					<FontAwesomeIcon icon={faTruckMoving} />
				</CustomButton>

				<CustomButton
					title="Descarregando"
					color={colors.redAccent[600]}
					ml={20}
					handleOpenModal={() =>
						handleOpenModal(dataModalText.descarregando)
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
				height="70%"
				sx={{
					backgroundColor: colors.blueOrigin[800],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
				}}
			>
				<HomeTable />
			</Box>
		</Box>
	);
};

export default HomePage;
