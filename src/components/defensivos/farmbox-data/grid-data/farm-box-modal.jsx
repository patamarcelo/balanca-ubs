import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, useCallback, useMemo } from "react";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createDictFarmBox } from "../../../../store/plantio/plantio.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectSafraCiclo } from "../../../../store/plantio/plantio.selector";
import { setAppFarmBox } from "../../../../store/plantio/plantio.actions";

import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import { nodeServer } from "../../../../utils/axios/axios.utils";

import FarmBoxDataTable from "./grid-table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";


// ⚡ ESTILO MEMOIZADO (fora do componente)
const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "95%",
	height: "85vh",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};



const ModalDataFarmbox = ({ handleClose, open }) => {

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();

	const dictSelectFarm = useSelector(createDictFarmBox, shallowEqual);
	const user = useSelector(selectCurrentUser, shallowEqual);
	const safraCiclo = useSelector(selectSafraCiclo, shallowEqual);

	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [appArray, setAppArray] = useState([]);
	const [finalArr, setFinalArr] = useState(false);
	const [onlyAppNotProducts, setOnlyAppNotProducts] = useState(true);
	const [reloadTable, setReloadTable] = useState(false);
	const [refreshData, setRefreshData] = useState(false);


	/* ==========================================================================
	   API CALL – MEMOIZADO
	   ========================================================================== */
	const getTrueApiFarmData = useCallback(async () => {
		if (dictSelectFarm.length === 0 || refreshData) {
			setLoading(true);
			try {
				const res = await nodeServer.get("/datadetail", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
						"X-Firebase-AppCheck": user.accessToken
					},
					params: { safraCiclo }
				});

				dispatch(setAppFarmBox(res.data));

			} catch (err) {
				console.log("Erro ao consumir API FarmBox", err);

			} finally {
				setLoading(false);
				setRefreshData(false);
			}
		}
	}, [dictSelectFarm.length, refreshData, user.accessToken, safraCiclo, dispatch]);


	const getTrueApiFarmDataRefresh = useCallback(async () => {
		setLoading(true);

		try {
			const res = await nodeServer.get("/datadetail", {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
					"X-Firebase-AppCheck": user.accessToken
				},
				params: { safraCiclo }
			});

			dispatch(setAppFarmBox(res.data));

		} catch (err) {
			console.log("Erro ao consumir API FarmBox", err);

		} finally {
			setLoading(false);
			setRefreshData(false);
		}

	}, [user.accessToken, safraCiclo, dispatch]);



	/* ==========================================================================
	   REFRESH CUANDO MODAL ABRE
	   ========================================================================== */
	useEffect(() => {
		if (open && refreshData) {
			getTrueApiFarmData();
		}
	}, [open, refreshData, getTrueApiFarmData]);




	/* ==========================================================================
	   CONSTRUTOR DO ARRAY – OTIMIZADO COM useCallback
	   ========================================================================== */
	const getArray = useCallback(() => {

		if (dictSelectFarm.length === 0) return;

		setFinalArr(false);

		try {
			const newarr = dictSelectFarm.flatMap((data) => {
				const { parcelas, insumos, progressos, areaSolicitada } = data;

				const parcelasDict = parcelas.map((parcela) => {
					let equipmentsArray = [];
					let sumTotalApp = 0;

					progressos.forEach((prog) => {
						prog.plantacoesAplicadas.forEach((areasApp) => {
							if (areasApp.idPlantacao === parcela.id_plantation) {
								sumTotalApp += areasApp.areaAplicadaPlantacao;
								equipmentsArray.push(areasApp.equipment);
							}
						});
					});

					const areaSought = areaSolicitada.find(
						(a) => a.idFarm === parcela.id_plantation
					)?.area;

					const statusParcelaDetail = (status, processo, area) => {
						if (status === "finalized" && processo === 0) return "Não Aplicado";
						if (status === "finalized") return "Aplicado";
						if (status === "sought") {
							return processo >= area ? "Aplicado" : "Aberto";
						}
					};

					return {
						...data,
						totalSomaUnform: sumTotalApp,
						totalSoma: sumTotalApp.toLocaleString("pt-br", { minimumFractionDigits: 2 }),
						parcela: parcela.parcela,
						variedade: parcela.variedade,
						cultura: parcela.cultura,
						safra: parcela.safra,
						ciclo: parcela.ciclo,
						statusParcela: statusParcelaDetail(data.status, sumTotalApp, parcela.area),
						dataPlantio: parcela.dataPlantio,
						idPlantation: parcela.id_plantation,
						area: parcela.area.toLocaleString("pt-br", { minimumFractionDigits: 2 }),
						areaSought: areaSought?.toLocaleString("pt-br", { minimumFractionDigits: 2 }),
						remaingArea: (areaSought - sumTotalApp)?.toLocaleString("pt-br", { minimumFractionDigits: 2 }),
						id: `${data.idCode}${parcela.parcela}`,
						equipmentsUsed: [...new Set(equipmentsArray)],
						fazenda: data.fazenda
					};
				});

				if (onlyAppNotProducts) {
					return parcelasDict;
				}

				return parcelasDict.flatMap((parc) =>
					insumos.map((ins) => {
						const quantidadeSolicitada = ins.dose * parc.areaSought;
						const quantidade = ins.dose * parc.totalSomaUnform;

						return {
							...parc,
							quantidadeSolicitada: quantidadeSolicitada.toLocaleString("pt-br", { minimumFractionDigits: 2 }),
							quantidade: quantidade.toLocaleString("pt-br", { minimumFractionDigits: 2 }),
							saldoAplicar: Math.max(0, quantidadeSolicitada - quantidade).toLocaleString("pt-br", { minimumFractionDigits: 2 }),
							dose: ins.dose.replace(".", ","),
							insumo: ins.insumo,
							insumo_id: ins.insumo_id,
							tipo: ins.tipo,
							id: `${parc.id}${ins.dose}${ins.insumo}`,
						};
					})
				);

			});

			setAppArray(newarr);

		} catch (err) {
			console.log("Erro ao formar array do Grid Farmbox", err);
		} finally {
			setFinalArr(true);
		}

	}, [dictSelectFarm, onlyAppNotProducts]);



	/* ==========================================================================
	   DISPARA CONSTRUÇÃO DO ARRAY
	   ========================================================================== */
	useEffect(() => {
		getArray();
	}, [getArray]);



	/* ==========================================================================
	   HANDLERS MEMOIZADOS
	   ========================================================================== */

	const handleOpOrProducts = useCallback(() => {
		setOnlyAppNotProducts((prev) => !prev);
	}, []);

	const handleRefreshData = useCallback(() => {
		setRefreshData(true);
		getTrueApiFarmDataRefresh();
	}, [getTrueApiFarmDataRefresh]);




	/* ==========================================================================
	   RENDER
	   ========================================================================== */

	const renderTable = useMemo(() => {
		if (loading) {
			return (
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
					<CircularProgress size={60} sx={{ color: colors.greenAccent[theme.palette.mode === "dark" ? 200 : 800] }} />
				</Box>
			);
		}

		if (appArray.length > 0 && !reloadTable) {
			return (
				<FarmBoxDataTable
					rows={appArray}
					loading={!finalArr}
					onlyAppNotProducts={onlyAppNotProducts}
				/>
			);
		}

		return null;
	}, [loading, appArray, reloadTable, finalArr, onlyAppNotProducts, colors, theme.palette.mode]);




	return (
		<Modal keepMounted open={open} onClose={handleClose}>
			<Box sx={modalStyle}>
				<Box display="flex" alignItems="center">

					<Chip
						label="Farmbox"
						sx={{ backgroundColor: colors.greenAccent[800], color: colors.primary[100] }}
					/>

					<Chip
						label="Atualizar"
						sx={{ backgroundColor: colors.blueAccent[800], color: colors.primary[100], ml: 2 }}
						onClick={handleRefreshData}
					/>

					<Chip
						label={onlyAppNotProducts ? "Operações" : "Produtos"}
						sx={{ backgroundColor: colors.blueAccent[800], color: colors.primary[100], ml: 2 }}
						onClick={handleOpOrProducts}
					/>

					<Box ml="auto" sx={{ cursor: "pointer" }}>
						<FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
					</Box>

				</Box>

				{renderTable}
			</Box>
		</Modal>
	);
};

export default ModalDataFarmbox;
