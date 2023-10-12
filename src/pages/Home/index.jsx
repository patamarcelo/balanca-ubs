import { Box, useTheme } from "@mui/material";
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
	selectTruOnWork
} from "../../store/trucks/trucks.selector";

import {
	selectIBalancaUser,
	selectUnidadeOpUser
	// selectDjangoToken
} from "../../store/user/user.selector";

import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { UNITS_OP } from "../../store/trucks/trucks.types";
import "./indexTabs.css";
import useMediaQuery from "@mui/material/useMediaQuery";

import toast from "react-hot-toast";

import { FAZENDA_ORIGEM } from "../../store/trucks/reducer.initials";

import { limit } from "firebase/firestore";

// import djangoApi from "../../utils/axios/axios.utils";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { formatDate } from "../../store/trucks/trucks.selector";

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
	const isNonMobile = useMediaQuery("(min-width: 900px)");
	const isCellPhone = useMediaQuery("(min-width: 500px)");

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);

	const isBalanca = useSelector(selectIBalancaUser);
	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	// const userDjangoToken = useSelector(selectDjangoToken);

	const truckWorks = useSelector(selectTruOnWork);

	const [dataModal, setDataModal] = useState({
		title: "",
		text: ""
	});

	const [saved, handlerSave] = useState(0);

	const [truckValues, setTruckValues] = useState(TRUCK_INITIAL_STATE);

	const [selectedUnitOp, setSelectedUnitOp] = useState(unidadeOpUser);
	const [allUnits, setAllUnits] = useState([]);

	const totalCarregando = useSelector(selectTrucksCarregando(selectedUnitOp));
	const totalDescarregando = useSelector(
		selectTrucksDescarregando(selectedUnitOp)
	);

	const [formatUnidade, setFormatUnidade] = useState("");

	// useEffect(() => {
	// 	djangoApi
	// 		.get("/get_plantio/", {
	// 			headers: {
	// 				Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
	// 			}
	// 		})
	// 		.then((res) => {
	// 			console.log(res.data);
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);

	useEffect(() => {
		const value = UNITS_OP.filter((data) => data.title === selectedUnitOp);
		setFormatUnidade(value[0].description);
	}, [selectedUnitOp]);

	useEffect(() => {
		if (unidadeOpUser === "ubs") {
			setAllUnits(UNITS_OP);
		} else {
			const filteredUnitOps = () => {
				UNITS_OP.filter((data) => data.title === unidadeOpUser);
			};
			setAllUnits(filteredUnitOps);
		}
	}, []);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.truckmove);
		const q = query(collRef, where("liquido", "==", ""), limit(500));
		onSnapshot(q, (snapshot) => {
			// console.log("SnapsDocs: ", snapshot.docs);
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
	}, [dispatch]);

	useEffect(() => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 250);
	}, [selectedUnitOp]);

	const handleOpenModal = async (obj, data) => {
		if (obj.title === "Editar Carga") {
			//otimizantion for APP
			// if (!data.entrada) {
			// 	const dateNew = new Date();
			// 	const forTime = {
			// 		nanoseconds: 0,
			// 		seconds: dateNew.getTime() / 1000
			// 	};
			// 	data.entrada = forTime;
			// }
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
		if (e.target.name === "tara" || e.target.name === "pesoBruto") {
			const re = /^[0-9\b]+$/;
			if (e.target.value === "" || re.test(e.target.value)) {
				setTruckValues((truckValues) => ({
					...truckValues
				}));
			} else {
				setTruckValues((truckValues) => ({
					...truckValues,
					[e.target.name]: e.target.value.replace(/\D/g, "")
				}));
			}
		}
		if (e.target.name === "fazendaOrigem") {
			setTruckValues((truckValues) => ({
				...truckValues,
				parcelasNovas: []
			}));
		}
		if (e.target.name === "placa") {
			setTruckValues((truckValues) => ({
				...truckValues,
				placa: e.target.value.replace(/[^a-z0-9]/gi, "").toUpperCase()
			}));
		}
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

	const handleChengeSelect = (data) => {
		setSelectedUnitOp(data.target.value);
	};

	const filteredTruckOnWork = (unidadeOp) => {
		const origemDest = [];
		const filteredOrigemDestino = FAZENDA_ORIGEM.filter(
			(data) => data.user === unidadeOp
		);
		filteredOrigemDestino.map((data) => {
			origemDest.push(data.local);
			return data;
		});
		return truckWorks.filter(
			(data) =>
				data.unidadeOp === unidadeOp ||
				origemDest.includes(data.fazendaOrigem) ||
				origemDest.includes(data.fazendaDestino)
		).length;
	};

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
			<Box
				display="flex"
				justifyContent={!isCellPhone && "space-between"}
			>
				<CustomButton
					// isBalanca={!isBalanca}
					title={`Carregando: ${totalCarregando}`}
					color={colors.greenAccent[600]}
					handleOpenModal={() => {
						if (!isBalanca) {
							toast.error(`Usuário Sem Permissão`, {
								position: "top-center"
							});
							return;
						}
						handleOpenModal(dataModalText.carregando);
					}}
				>
					<FontAwesomeIcon
						icon={faTruckMoving}
						style={{
							filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
						}}
					/>
				</CustomButton>

				<CustomButton
					// isBalanca={!isBalanca}
					title={`Descarregando: ${totalDescarregando}`}
					color={colors.redAccent[600]}
					ml={20}
					handleOpenModal={() => {
						if (!isBalanca) {
							toast.error(`Usuário Sem Permissão`, {
								position: "top-center"
							});
							return;
						}
						handleOpenModal(dataModalText.descarregando);
					}}
				>
					<FontAwesomeIcon
						icon={faTruckMoving}
						style={{
							filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
						}}
					/>
				</CustomButton>
			</Box>
			<Box
				display="flex"
				justifyContent={isNonMobile ? "start" : "center"}
				className={isNonMobile ? "tabs" : ""}
				sx={{
					marginBottom: isNonMobile ? "-22px" : "-5px",
					marginLeft: isNonMobile ?? "15px",
					borderRadius: !isNonMobile ?? "8px",
					"& label": {
						color: `whitesmoke !important`
					}
				}}
			>
				{allUnits && allUnits.length > 0 && !isNonMobile ? (
					<Box
						sx={{
							width: "99%",
							pading: "10px 20px",
							borderRadius: "8px"
						}}
					>
						<FormControl
							sx={{
								width: "100%",
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px"
							}}
						>
							<InputLabel id="demo-simple-select-label">
								unidade
							</InputLabel>
							<Select
								sx={{ width: "100%" }}
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={selectedUnitOp}
								label="Unidade"
								onChange={handleChengeSelect}
							>
								{allUnits.map((data, i) => {
									return (
										<MenuItem value={data.title} key={i}>
											{data.description} &nbsp;&nbsp;
											{filteredTruckOnWork(data.title)}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Box>
				) : (
					allUnits &&
					allUnits.length > 0 &&
					allUnits.map((data, i) => {
						return (
							<>
								{isNonMobile && (
									<Box
										key={i}
										sx={{
											marginLeft:
												i > 0 && "-2px !important",
											zIndex:
												selectedUnitOp === data.title &&
												1,
											backgroundColor:
												selectedUnitOp === data.title
													? colors.blueOrigin[700]
													: "#22343F",
											color:
												selectedUnitOp === data.title
													? colors.primary[100]
													: "#667279",
											padding: "5px 25px 5px 15px",
											cursor: "pointer",
											textTransform: "capitalize",
											borderRadius: "4px",
											border: "0.5px solid black",
											boxShadow:
												selectedUnitOp === data.title &&
												`rgba(255, 255, 255, 0.3) 2px 2px 4px 0px inset`
										}}
										onClick={() =>
											handleFilteredUnidadeOp(data.title)
										}
									>
										{data.description} &nbsp;&nbsp;
										{filteredTruckOnWork(data.title)}
									</Box>
								)}
							</>
						);
					})
				)}
			</Box>
			<Box
				width="100%"
				p={1}
				sx={{
					backgroundColor: colors.blueOrigin[700],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.3) 2px 2px 4px 0px inset, rgba(255, 255, 255, 0.3) -1px -1px 3px 1px inset;`,
					overflow: "auto",
					position: "relative",
					height: isNonMobile ? "90%" : "80%",
					zIndex: 2,
					border:
						theme.palette.mode === "dark"
							? ""
							: `0.1px solid ${colors.primary[100]}`
				}}
			>
				<Box
					width="100%"
					sx={{
						backgroundColor: colors.blueOrigin[700],
						borderRadius: "8px",
						overflow: "auto",
						position: "relative",
						height: "100%"
						// border: `0.1px solid ${colors.primary[100]}`
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
		</Box>
	);
};

export default HomePage;
