import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomButton from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import HomeTable from "../../components/home-itens/home-table";
import { useState, useEffect } from "react";

import FormDialog from "../../components/home-itens/modal-form-truck";

import { TRUCK_INITIAL_STATE } from "../../store/trucks/reducer.initials";

import { useDispatch } from "react-redux";
import { setTruckLoads } from "../../store/trucks/trucks.actions";
// import { getTruckMoves } from "../../utils/firebase/firebase.datatable";

import { useSelector } from "react-redux";
import {
	selectTrucksCarregando,
	selectTrucksDescarregando,
	selectTruckLoadsOnWork
} from "../../store/trucks/trucks.selector";

import {
	selectIBalancaUser,
	selectUnidadeOpUser
} from "../../store/user/user.selector";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { UNITS_OP } from "../../store/trucks/trucks.types";
import "./indexTabs.css";

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

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);

	const isBalanca = useSelector(selectIBalancaUser);
	const unidadeOpUser = useSelector(selectUnidadeOpUser);

	const [dataModal, setDataModal] = useState({
		title: "",
		text: ""
	});

	const [saved, handlerSave] = useState(0);

	const [truckValues, setTruckValues] = useState(TRUCK_INITIAL_STATE);

	const [selectedUnitOp, setSelectedUnitOp] = useState(unidadeOpUser);

	const totalCarregando = useSelector(selectTrucksCarregando(selectedUnitOp));
	const totalDescarregando = useSelector(
		selectTrucksDescarregando(selectedUnitOp)
	);

	const [formatUnidade, setFormatUnidade] = useState("");

	useEffect(() => {
		const value = UNITS_OP.filter((data) => data.title === selectedUnitOp);
		setFormatUnidade(value[0].description);
	}, [selectedUnitOp]);

	// const table = useSelector(selectTruckLoadsOnWork);

	// useEffect(() => {
	// 	const getData = async () => {
	// 		setIsLoading(true);
	// 		const data = await getTruckMoves();
	// 		dispatch(setTruckLoads(data));
	// 		setIsLoading(false);
	// 	};
	// 	getData();
	// }, []);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.truckmove);
		const q = query(collRef, orderBy("createdAt"));
		onSnapshot(q, (snapshot) => {
			dispatch(
				setTruckLoads(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						id: doc.id
					}))
				)
			);
		});
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	useEffect(() => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 250);
	}, [selectedUnitOp]);

	const handleOpenModal = async (obj, data) => {
		if (obj.title === "Editar Carga") {
			await setTruckValues(data);
			setDataModal({
				title: obj.title,
				text: obj.text,
				color: obj.color
			});
			setIsOpenModal(true);
		} else {
			setDataModal({
				title: obj.title,
				text: obj.text,
				color: obj.color
			});
			setTruckValues({ ...truckValues, tipo: obj.title.toLowerCase() });
			setIsOpenModal(true);
		}
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
		setTruckValues({ ...truckValues, [e.target.name]: e.target.value });
	};

	const handleBlurTruck = (e) => {
		const pesoBruto = truckValues["pesoBruto"];
		const tara = truckValues["tara"];
		if (["pesoBruto", "tara"].includes(e.target.name)) {
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

	const handleFilteredUnidadeOp = (data) => {
		setSelectedUnitOp(data);
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
					isBalanca={!isBalanca}
					title={`Carregando: ${totalCarregando}`}
					color={colors.greenAccent[600]}
					handleOpenModal={() =>
						handleOpenModal(dataModalText.carregando)
					}
				>
					<FontAwesomeIcon icon={faTruckMoving} />
				</CustomButton>

				<CustomButton
					isBalanca={!isBalanca}
					title={`Descarregando: ${totalDescarregando}`}
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
				justifyContent="start"
				className="tabs"
				sx={{
					// border: "1px solid white",
					marginBottom: "-22px",
					marginLeft: "15px"
				}}
			>
				{UNITS_OP.map((data, i) => {
					return (
						<Box
							key={i}
							sx={{
								backgroundColor:
									selectedUnitOp === data.title
										? colors.blueOrigin[700]
										: "#22343F",
								color:
									selectedUnitOp === data.title
										? "white"
										: "#667279",
								padding: "10px",
								cursor: "pointer",
								textTransform: "capitalize",
								borderRadius: "4px"
							}}
							onClick={() => handleFilteredUnidadeOp(data.title)}
						>
							{data.description}
						</Box>
					);
				})}
			</Box>
			<Box
				width="100%"
				height="80%"
				sx={{
					backgroundColor: colors.blueOrigin[700],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`,
					overflow: "auto",
					overflowX: "hidden",
					position: "relative",
					border: `0.1px solid ${colors.primary[100]}`
				}}
			>
				<HomeTable
					formatUnidade={formatUnidade}
					selectedUnitOp={selectedUnitOp}
					saved={saved}
					handlerSave={handlerSave}
					isOpenModal={isOpenModal}
					handleCloseModal={handleCloseModal}
					dataModal={dataModal}
					handleCloseModalEsc={handleCloseModalEsc}
					handleChangeTruck={handleChangeTruck}
					handleBlurTruck={handleBlurTruck}
					truckValues={truckValues}
					setTruckValues={setTruckValues}
					handleOpenModal={handleOpenModal}
					isLoadingHome={isLoadingHome}
				/>
			</Box>
		</Box>
	);
};

export default HomePage;
