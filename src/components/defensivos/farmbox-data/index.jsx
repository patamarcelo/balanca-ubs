import classes from "./farmbox.module.css";
import { nodeServer } from "../../../utils/axios/axios.utils";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import {
	selectApp,
	createDict,
	createDictFarmBox,
	onlyFarm
} from "../../../store/plantio/plantio.selector";
import { setApp, setAppFarmBox } from "../../../store/plantio/plantio.actions";

import { useDispatch, useSelector } from "react-redux";

import LinearProgress from "@mui/material/LinearProgress";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Divider from "@mui/material/Divider";
import TableDataPage from "./table-data-app";
import HeaderApp from "./header-app";
import ResumoDataPage from "./resumo-data-page";
import ResumoFazendasPage from "./resumos-fazendas-page";

import { geralAppDetail } from "../../../store/plantio/plantio.selector";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { selectCurrentUser } from "../../../store/user/user.selector";
import ModalDataFarmbox from "./grid-data/farm-box-modal";

const FarmBoxPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [loadingData, setLoadinData] = useState(false);
	const dispatch = useDispatch();
	const openApp = useSelector(selectApp);
	const dictSelect = useSelector(createDict);
	// const dictSelectFarm = useSelector(createDictFarmBox);
	const onlyFarms = useSelector(onlyFarm);
	const [filtFarm, setFiltFarm] = useState([]);
	const [filteredApps, setFilteredApps] = useState([]);
	const dataGeral = useSelector(geralAppDetail);
	const [saldoAplicar, setSaldoAplicar] = useState(0);
	const [openAppOnly, setOpenAppOnly] = useState(false);

	const user = useSelector(selectCurrentUser);

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250
			}
		}
	};

	const handleCheckOpenApp = () => {
		setOpenAppOnly(!openAppOnly);
	};

	const handleAllFarms = () => {
		if (filtFarm.length > 0) {
			setFiltFarm([]);
		} else {
			setFiltFarm(onlyFarms);
		}
	};

	const handleChange = (event) => {
		const {
			target: { value }
		} = event;
		setFiltFarm(typeof value === "string" ? value.split(",") : value);
	};

	useEffect(() => {
		const filterFarm = dictSelect.filter((data) =>
			filtFarm.includes(data.fazenda)
		);
		setFilteredApps(filterFarm);
	}, [filtFarm, dictSelect]);

	const getTrueApi = useCallback(async () => {
		try {
			setLoadinData(true);
			await nodeServer
				.get("/", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
						"X-Firebase-AppCheck": user.accessToken
					}
				})
				.then((res) => {
					dispatch(setApp(res.data));
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("Erro ao consumir a API", err);
		} finally {
			setLoadinData(false);
			// console.log("Finally statement");
		}
	}, [dispatch]);

	useEffect(() => {
		if (openApp.length === 0) {
			getTrueApi();
		}
	}, [getTrueApi, openApp]);

	const refreshData = () => {
		dispatch(setApp([]));
		dispatch(setAppFarmBox([]));
	};

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	// useEffect(() => {
	// 	if (openApp.length > 0) {
	// 		console.log(dictSelect);
	// 		console.log(onlyFarms);
	// 	}
	// }, [openApp]);

	useEffect(() => {
		let saldoAplicar = 0;
		filtFarm.forEach((data, index) => {
			if (data in dataGeral.fazendas) {
				saldoAplicar += dataGeral?.fazendas[data]?.saldo;
			}
		});
		setSaldoAplicar(saldoAplicar);
	}, [filtFarm, dataGeral]);

	return (
		<div className={classes.mainDiv}>
			{!loadingData && (
				<Box
					p={1}
					sx={{
						backgroundColor: colors.blueOrigin[800],
						borderRadius: "8px"
					}}
				>
					<Button onClick={() => refreshData()} color="success">
						Atualizar
					</Button>

					<Button onClick={() => handleOpen()} color="success">
						Gerar Tabela
					</Button>
					<ModalDataFarmbox open={open} handleClose={handleClose} />
				</Box>
			)}
			{!loadingData && onlyFarms.length > 0 && (
				<Box className={classes.formDiv}>
					<FormControl
						sx={{
							m: 1,
							width: 900,
							backgroundColor: colors.blueOrigin[800]
						}}
					>
						<InputLabel id="demo-multiple-name-label">
							Farm
						</InputLabel>
						<Select
							labelId="demo-multiple-name-label"
							id="demo-multiple-name"
							multiple
							value={filtFarm}
							onChange={handleChange}
							input={<OutlinedInput label="Farm" />}
							MenuProps={MenuProps}
						>
							{onlyFarms
								?.sort((a, b) => a.localeCompare(b))
								.map((farm, i) => (
									<MenuItem
										key={i}
										value={farm}
										//   style={getStyles(name, personName, theme)}
									>
										{farm}
									</MenuItem>
								))}
						</Select>
					</FormControl>
					<FormControlLabel
						control={
							<Checkbox
								onChange={handleCheckOpenApp}
								color="success"
							/>
						}
						label="Finalizadas"
						labelPlacement="end"
					/>
					<FormControlLabel
						control={
							<Checkbox
								onChange={handleAllFarms}
								color="success"
							/>
						}
						label="Todas"
						labelPlacement="end"
					/>
				</Box>
			)}
			<div className={classes.dashboardDiv}>
				{loadingData && (
					<Box sx={{ width: "100%" }}>
						<LinearProgress color="success" />
					</Box>
				)}
				<div className={classes.dashLeft}>
					{filtFarm?.map((data, i) => {
						const hasApp = (obj) => obj.fazenda === data;
						return (
							<>
								{filteredApps.some(hasApp) && (
									<>
										<div
											key={i}
											style={{
												margin: "29px"
											}}
										>
											<Divider>{data}</Divider>
										</div>

										<HeaderApp />
									</>
								)}
								<div className={classes.mainDivLeft}>
									{filteredApps
										.filter((data) =>
											!openAppOnly
												? data.status === "sought"
												: data.status === "sought" ||
												  "finalized"
										)
										.sort((b, a) =>
											a.status.localeCompare(b.status)
										)
										.sort(
											(a, b) =>
												a.app.slice(2) - b.app.slice(2)
										)
										.map((app, i) => {
											if (app.fazenda === data) {
												return (
													<TableDataPage
														colors={colors}
														key={i}
														dataF={app}
													/>
												);
											}
											return <></>;
										})}
								</div>
							</>
						);
					})}
				</div>
				<div className={classes.dashRight}>
					{filteredApps.length > 0 && (
						<div className={classes.resumoAppPage}>
							<div className={classes.headerDivApp}>
								<Divider>
									<h3>Resumo Geral</h3>
								</Divider>
							</div>
							<div
								className={classes.bodyDivApp}
								style={{
									backgroundColor: colors.blueOrigin[700]
								}}
							>
								<ResumoDataPage />
							</div>
							{filtFarm && (
								<>
									<Box sx={{ width: "100%" }} mt={3}>
										<Divider>
											<h3>
												Resumo Fazendas -{" "}
												{saldoAplicar.toLocaleString(
													"pt-br",
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2
													}
												)}
											</h3>
										</Divider>
									</Box>
									<div
										className={classes.resumoFazendasPage}
										style={{
											backgroundColor:
												colors.blueOrigin[700]
										}}
									>
										{filtFarm
											?.sort((a, b) => a.localeCompare(b))
											.map((farm, i) => {
												const hasDivider =
													filtFarm.length - 1 === i;
												return (
													<ResumoFazendasPage
														colors={colors}
														fazenda={farm}
														key={i}
														divider={!hasDivider}
													/>
												);
											})}
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
			{!loadingData && filteredApps.length === 0 && (
				<Box className={classes.emptyFarm}>
					<span>Selecione uma fazenda</span>
				</Box>
			)}
		</div>
	);
};

export default FarmBoxPage;
