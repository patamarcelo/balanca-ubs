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
import TableDataPage from "./table-data-app";
import HeaderApp from "./header-app";
import ResumoDataPage from "./resumo-data-page";

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
			)}
			<div className={classes.dashboardDiv}>
				{loadingData && (
					<Box sx={{ width: "100%" }}>
						<LinearProgress color="success" />
					</Box>
				)}
				<div className={classes.dashLeft}>
					{filtFarm?.map((data, i) => {
						return (
							<>
								<div key={i} style={{ margin: "20px" }}>
									<Divider>{data}</Divider>
								</div>
								<HeaderApp />
								<div className={classes.mainDivLeft}>
									{filteredApps.map((app, i) => {
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
								<Divider>Resumo Aplicações</Divider>
							</div>
							<div className={classes.bodyDivApp}>
								<ResumoDataPage />
							</div>
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
