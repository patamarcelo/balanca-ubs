import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect } from "react";
import classes from "./data-program.module.css";

import { displayDate } from "../../../utils/format-suport/data-format";
import DateIntervalPage from "./date-interval";

const DataProgramPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { dataDef, isLoadingHome } = props;

	const [farmList, setFarmList] = useState([]);
	const [farmParcelasList, setFarmParcelasList] = useState([]);
	const [objList, setObjList] = useState([]);

	const [filteredList, setFilteredList] = useState([]);
	const [farmSelected, setFarmSelected] = useState("");

	const [initialDateForm, setInitialDate] = useState(
		new Date().toISOString().slice(0, 10)
	);
	const [finalDateForm, setFinalDateForm] = useState(null);

	useEffect(() => {
		const initDa = new Date().toISOString().slice(0, 10);
		console.log(initDa);
	}, []);

	useEffect(() => {
		const listFarm = dataDef
			.filter((data) => data.dados.plantio_finalizado === true)
			.map((data, i) => {
				return data.fazenda;
			});
		setFarmList([...new Set(listFarm)].sort());
		handleFilterList([...new Set(listFarm)].sort()[0]);
	}, []);

	const handleFilterList = (farmName) => {
		setFarmSelected(farmName);
		const filtList = dataDef.filter(
			(data) =>
				data.fazenda === farmName &&
				data.dados.plantio_finalizado === true
		);
		setFilteredList(filtList);
	};

	useEffect(() => {
		const filtParcelas = filteredList.map((data, i) => {
			const initialDate = initialDateForm;
			const finalDate = finalDateForm ? finalDateForm : "2023-05-29";
			const cronograma = data.dados.cronograma;
			const cronArr = cronograma.map((cron, i) => {
				let cronOb;
				const dataPrev = cron["data prevista"];
				if (dataPrev >= initialDate && dataPrev <= finalDate) {
					const estagio = cron.estagio;
					const dataPrevApp = dataPrev;
					const dapApp = cron.dap;
					const parcela = data.parcela;
					const variedade = data.dados.variedade;
					const dataPlantio = data.dados.data_plantio;
					const area = data.dados.area_colheita;
					const dap = data.dados.dap;
					const cultura = data.dados.cultura;
					cronOb = {
						parcela,
						variedade,
						dataPlantio,
						estagio,
						dataPrevApp,
						dapApp,
						area,
						dap,
						cultura
					};
				}
				return cronOb;
			});
			return cronArr.filter((data) => data !== undefined);
		});
		const filtArray = filtParcelas
			.flat()
			.sort((a, b) => new Date(a.dataPrevApp) - new Date(b.dataPrevApp));

		const result = filtArray.reduce((acc, curr) => {
			const estagio = curr.estagio;
			const dapApp = curr.dapApp;
			if (dapApp > 0) {
				if (acc[estagio] == null) acc[estagio] = [];
				acc[estagio].push(curr);
			}
			return acc;
		}, {});

		const dictTotal = [];
		Object.keys(result).map((data, i) => {
			const dic = {};
			dic["estagio"] = data;
			dic["cronograma"] = result[data];
			const total = result[data].reduce((acc, curr) => {
				return curr.area + acc;
			}, 0);
			dic["total"] = total.toFixed(2).replace(".", ",");
			dictTotal.push(dic);
			return dic;
		});

		setObjList(dictTotal);
		console.log(dictTotal);
		setFarmParcelasList(
			filtParcelas
				.flat()
				.sort(
					(a, b) => new Date(a.dataPrevApp) - new Date(b.dataPrevApp)
				)
		);
	}, [filteredList, initialDateForm, finalDateForm]);

	return (
		<Box className={classes.mainDiv}>
			<Box className={classes.div}>
				{farmList.map((data, i) => {
					return (
						<Box key={i} gap={10}>
							<Typography
								className={
									farmSelected === data
										? classes["div-selected"]
										: classes["div-not-selected"]
								}
								variant="h5"
								color={colors.greenAccent[500]}
								onClick={() => handleFilterList(data)}
							>
								{data}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box className={classes["date-picker-div"]}>
				<div className={classes["date-picker"]}>
					<DateIntervalPage
						setInitialDate={setInitialDate}
						initialDateForm={initialDateForm}
						label="Data Inicial"
					/>
					<DateIntervalPage
						setInitialDate={setFinalDateForm}
						initialDateForm={finalDateForm}
						label="Data Final"
					/>
				</div>
				<div className={classes["title-div-picker"]}>
					<Typography variant="h4" color={colors.primary[200]}>
						Programações:{" "}
						{initialDateForm && displayDate(initialDateForm)} até{" "}
						{finalDateForm && displayDate(finalDateForm)}
					</Typography>
				</div>
			</Box>
			<Box className={classes["box-program"]}>
				<Box className={classes["fazenda-div"]}>{farmSelected}</Box>
				<Box className={classes["geral-program-div"]}>
					{objList.map((data, i) => {
						return (
							<div
								key={i}
								className={classes["detail-parcela-div"]}
							>
								<div className={classes["estagio-div"]}>
									<p>{data.estagio}</p>
									<p style={{ color: colors.primary[200] }}>
										Area Total: {data.total}
									</p>
								</div>
								<div className={classes["parcelas-resumo-div"]}>
									<div>
										{data.cronograma.map((data, i) => {
											return (
												<div
													key={i}
													className={
														classes[
															"parcelas-detail-div"
														]
													}
												>
													<div
														className={
															classes[
																"parcela-div"
															]
														}
													>
														{data.parcela}
													</div>
													<div
														style={{
															color: colors
																.greenAccent[300]
														}}
													>
														{displayDate(
															data.dataPlantio
														)}
													</div>
													<div>
														{data.dap < 10
															? "0" + data.dap
															: data.dap}
													</div>
													<div>{data.cultura}</div>
													<div>{data.variedade}</div>
													<div>
														{displayDate(
															data.dataPrevApp
														)}
													</div>
													<div>{data.dapApp}</div>
													<div
														style={{
															color: colors
																.primary[200]
														}}
													>
														{data.area
															.toFixed(2)
															.replace(".", ",")}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
};

export default DataProgramPage;
