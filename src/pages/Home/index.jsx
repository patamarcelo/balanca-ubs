import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomButton from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import HomeTable from "../../components/home-itens/home-table";
import { useState, useEffect } from "react";

import FormDialog from "../../components/home-itens/modal-form-truck";

import {TRUCK_INITIAL_STATE} from '../../store/trucks/reducer.initials'

const dataModalText = {
	carregando: {
		title: "Carregando",
		color: "success",
		text: "formulário do carregamento formulário do carregamento formulário do carregamento formulário do carregamento "
	},
	descarregando: {
		title: "Descarregando",
		color: "error",
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

	const [saved, handlerSave] = useState(0)



	const [truckValues, setTruckValues] = useState(TRUCK_INITIAL_STATE);

	const handleOpenModal = (obj) => {
		setDataModal({
			title: obj.title,
			text: obj.text,
			color: obj.color
		});
		setTruckValues({ ...truckValues, tipo: obj.title.toLowerCase() });
		setIsOpenModal(true);
	};
	const handleCloseModal = (e) => {
		setTruckValues(TRUCK_INITIAL_STATE);
		setIsOpenModal(false);
	};
	const handleCloseModalEsc = (event) => {
		if (event.type === "keydown" && event.key === "Escape") {
			setIsOpenModal(false);
			setTruckValues(TRUCK_INITIAL_STATE);
		}
	};

	const handleChangeTruck = (e) => {
		if (typeof e.$L === "string") {
			console.log(typeof e.$d);
			const newDate = new Date(e.$d);
			setTruckValues({ ...truckValues, data: newDate });
		} else {
			setTruckValues({ ...truckValues, [e.target.name]: e.target.value });
		}
	};

	const handleBlurTruck = (e) => {
		const pesoBruto = truckValues["pesoBruto"];
		const tara = truckValues["tara"];
		if (["pesoBruto", "tara"].includes(e.target.name)) {
			console.log(e.target.name, e.target.value);
			if (pesoBruto > 0 && tara > 0) {
				const liquido = pesoBruto - tara;
				if (liquido < 0) {
					setTruckValues({
						...truckValues,
						liquido: "Valor Negativo, verificar"
					});
					console.log("valor negativo");
				} else {
					setTruckValues({ ...truckValues, liquido: liquido });
				}
			} else {
				setTruckValues({ ...truckValues, liquido: "" });
			}
		}
	};

	// console.log(truckValues)

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap="20px"
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
				handleBlurTruck={handleBlurTruck}
				truckValues={truckValues}
				setTruckValues={setTruckValues}
				handlerSave={handlerSave}
				saved={saved}
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
				width="100%"
				height="80%"
				sx={{
					backgroundColor: colors.blueOrigin[700],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`,
					overflow: 'auto',
					overflowX: 'hidden',
					position: 'relative',
					border: `0.1px solid ${colors.primary[100]}`,
				}}
			>
				<HomeTable saved={saved}/>
			</Box>
		</Box>
	);
};

export default HomePage;
