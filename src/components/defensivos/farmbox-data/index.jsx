import classes from "./farmbox.module.css";
import { nodeServer } from "../../../utils/axios/axios.utils";
import { useEffect, useState, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import {
	selectApp,
	createDict,
	onlyFarm
} from "../../../store/plantio/plantio.selector";
import { setApp } from "../../../store/plantio/plantio.actions";

import { useDispatch, useSelector } from "react-redux";

import LinearProgress from "@mui/material/LinearProgress";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Divider from "@mui/material/Divider";

const FarmBoxPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [loadingData, setLoadinData] = useState(false);
	const dispatch = useDispatch();
	const openApp = useSelector(selectApp);
	const dictSelect = useSelector(createDict);
	const onlyFarms = useSelector(onlyFarm);
	const [filtFarm, setFiltFarm] = useState([]);
	const [filteredApps, setFilteredApps] = useState([]);

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
	}, [filtFarm]);

	const getTrueApi = useCallback(async () => {
		try {
			setLoadinData(true);
			await nodeServer
				.get("", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
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
	}, []);

	useEffect(() => {
		if (openApp.length === 0) {
			getTrueApi();
		}
	}, [getTrueApi, openApp]);

	useEffect(() => {
		if (openApp.length > 0) {
			console.log(dictSelect);
			console.log(onlyFarms);
		}
	}, [openApp]);

	return (
		<div className={classes.mainDiv}>
			<Box className={classes.formDiv}>
				<FormControl
					sx={{
						m: 1,
						width: 900,
						backgroundColor: colors.blueOrigin[800]
					}}
				>
					<InputLabel id="demo-multiple-name-label">Farm</InputLabel>
					<Select
						labelId="demo-multiple-name-label"
						id="demo-multiple-name"
						multiple
						value={filtFarm}
						onChange={handleChange}
						input={<OutlinedInput label="Farm" />}
						MenuProps={MenuProps}
					>
						{onlyFarms?.map((farm, i) => (
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
			</Box>
			<div className={classes.dashboardDiv}>
				{loadingData && (
					<Box sx={{ width: "100%" }}>
						<LinearProgress color="success" />
					</Box>
				)}
				<div className={classes.dashLeft}>
					{filteredApps?.map((data, i) => {
						const opTipo =
							data.operacaoTipo === "Operação"
								? data.operacao
								: "Sem Operação Informada";
						return (
							<div key={i}>
								{filteredApps[i]?.fazenda !==
								filteredApps[i - 1]?.fazenda ? (
									<Divider>{data.fazenda}</Divider>
								) : null}
								<div
									className={classes.appDiv}
									style={{
										backgroundColor: colors.blueOrigin[700]
									}}
								>
									<span>{data.app}</span>
									<Box className={classes.appNumero}>
										<Box
											display="flex"
											flexDirection="row"
											justifyContent="center"
											alignItems="center"
											sx={{
												width: "50%",
												height: "100%",
												// backgroundColor: "red",
												fontSize: "12px"
											}}
										>
											{/* <span>{data.app}</span> */}
											<span>{opTipo}</span>
											<span>{data.cultura}</span>
										</Box>
										<Box
											// sx={{ width: "50%", backgroundColor: "green" }}
											sx={{ width: "50%" }}
										>
											<span>
												Area Solicitada: {data.area}
											</span>
											<span>
												Area Aplicada:{" "}
												{data.areaAplicada}
											</span>

											{/* {data.parcelas.map((parc, i) => {
									return (
										<div key={i}>
											<span>{parc.parcela}</span>
											<span>{parc.area}</span>
											<span>{parc.variedade}</span>
											<span>
												{parc.aplicado
													? "Aplicado"
													: "Pendente"}
											</span>
										</div>
									);
								})} */}
										</Box>
									</Box>
								</div>
							</div>
						);
					})}
				</div>
				<div className={classes.dashRight}>
					{filteredApps.length > 0 && <p>dados das aplicações</p>}
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
