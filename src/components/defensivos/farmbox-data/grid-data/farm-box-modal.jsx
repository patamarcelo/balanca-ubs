import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState, useCallback } from "react";
import FarmBoxDataTable from "./grid-table";

import { useDispatch, useSelector } from "react-redux";
import { createDictFarmBox } from "../../../../store/plantio/plantio.selector";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import Chip from "@mui/material/Chip";

import { nodeServer } from "../../../../utils/axios/axios.utils";
import { setAppFarmBox } from "../../../../store/plantio/plantio.actions";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import CircularProgress from "@mui/material/CircularProgress";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "95%",
	height: "85vh",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4
};

const ModalDataFarmbox = (props) => {
	const { handleClose, open } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [appArray, setAppArray] = useState([]);
	const [finalArr, setFinalArr] = useState(false);
	const [onlyAppNotProducts, setOnlyAppNotProducts] = useState(true);
	const [reloadTable, setReloadTable] = useState(false);

	const dispatch = useDispatch();

	const dictSelectFarm = useSelector(createDictFarmBox);
	const user = useSelector(selectCurrentUser);

	const getTrueApiFarmData = useCallback(async () => {
		try {
			setLoading(true);
			await nodeServer
				.get("/datadetail", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
						"X-Firebase-AppCheck": user.accessToken
					}
				})
				.then((res) => {
					dispatch(setAppFarmBox(res.data));
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("Erro ao consumir a API de dados do FarmBox", err);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		getTrueApiFarmData();
	}, []);

	const handleOpOrProducts = () => {
		setOnlyAppNotProducts(!onlyAppNotProducts);
	};

	useEffect(() => {
		setReloadTable(true);
		setTimeout(() => {
			setReloadTable(false);
		}, 750);
	}, [onlyAppNotProducts]);

	const getArray = async () => {
		setFinalArr(false);
		try {
			const newarr = await dictSelectFarm.map((data) => {
				const { parcelas, insumos, progressos } = data;
				const parcelasDict = parcelas.map((parcela) => {
					let sumTotalApp = 0;
					const totalApplicado = progressos.map((prog) => {
						prog.plantacoesAplicadas.map((areasApp) => {
							if (
								areasApp.idPlantacao === parcela.id_plantation
							) {
								sumTotalApp += areasApp.areaAplicadaPlantacao;
							}
						});
						return sumTotalApp;
					});
					return {
						...data,
						totalSoma: sumTotalApp.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}),
						parcela: parcela.parcela,
						variedade: parcela.variedade,
						cultura: parcela.cultura,
						safra: parcela.safra,
						ciclo: parcela.ciclo,
						dataPlantio: parcela.dataPlantio,
						idPlantation: parcela.id_plantation,
						area: parcela.area,
						areaForm: parcela.area.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}),
						id: `${data.idCode}${parcela.parcela}`
					};
				});
				console.log(parcelasDict);
				const appParcelasDict = parcelasDict.map((parc) => {
					const withInsumos = insumos.map((ins) => {
						return {
							...parc,
							quantidade: (ins.dose * parc.area).toLocaleString(
								"pt-br",
								{
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								}
							),
							area: parc.area.toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}),
							dose: ins.dose.replace(".", ","),
							insumo: ins.insumo,
							tipo: ins.tipo,
							id: `${parc.id}${ins.dose}${ins.insumo}`
						};
					});
					return withInsumos;
				});

				if (onlyAppNotProducts) {
					return parcelasDict;
				} else {
					return appParcelasDict.flat();
				}
			});
			setAppArray(newarr.flat());
		} catch (err) {
			console.log("erro ao formar o Array do Grid Farmbox", err);
		} finally {
			setFinalArr(true);
		}
	};

	useEffect(() => {
		if (dictSelectFarm) {
			getArray();
		}
	}, [dictSelectFarm, onlyAppNotProducts]);

	// console.log(appArray);
	return (
		<div>
			<Modal
				keepMounted
				open={open}
				onClose={handleClose}
				aria-labelledby="keep-mounted-modal-title"
				aria-describedby="keep-mounted-modal-description"
			>
				<Box sx={style}>
					<Box
						id="keep-mounted-modal-title"
						display="flex"
						sx={{
							"& .fa-cirle": {
								marginLeft: "auto"
							},
							"& .fa-cirle:hover": {
								opacity: 0.5
							}
						}}
					>
						<Chip
							id="close-btn"
							label="Farmbox"
							color="primary"
							size="medium"
							sx={{
								backgroundColor: colors.greenAccent[800],
								color: colors.primary[100]
							}}
						/>
						<Chip
							label="Atualizar"
							color="primary"
							size="medium"
							onClick={() => getTrueApiFarmData()}
							sx={{
								backgroundColor: colors.blueAccent[800],
								color: colors.primary[100],
								marginLeft: "20px"
							}}
						/>
						<Chip
							label={
								onlyAppNotProducts ? "Operações" : "Produtos"
							}
							color="primary"
							size="medium"
							onClick={() => handleOpOrProducts()}
							sx={{
								backgroundColor: colors.blueAccent[800],
								color: colors.primary[100],
								marginLeft: "20px"
							}}
						/>
						<Box
							className="fa-cirle"
							display="flex"
							justifyContent="center"
							alignItems="center"
							sx={{
								cursor: "pointer"
							}}
						>
							<FontAwesomeIcon
								icon={faCircleXmark}
								onClick={() => handleClose()}
							/>
						</Box>
					</Box>

					{!loading && appArray.length > 0 && !reloadTable && (
						<FarmBoxDataTable
							rows={appArray}
							loading={!finalArr}
							onlyAppNotProducts={onlyAppNotProducts}
						/>
					)}

					{(loading || reloadTable) && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "100%"
							}}
						>
							<CircularProgress
								size={60}
								sx={{
									margin: "-10px 10px",
									color: (theme) =>
										colors.greenAccent[
											theme.palette.mode === "dark"
												? 200
												: 800
										]
								}}
							/>
						</Box>
					)}
				</Box>
			</Modal>
		</div>
	);
};

export default ModalDataFarmbox;
